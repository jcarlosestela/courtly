import { createServer } from "node:http";
import { IncomingMessage as NodeIncomingMessage, Server as NodeServer, ServerResponse } from "node:http";
import { AppConfig, loadConfig } from "../../config/env";
import { InMemoryIdempotencyStore } from "../../application/services/in-memory-idempotency-store";
import { HandleIncomingMessage } from "../../application/use-cases/handle-incoming-message";
import { buildChannelAdapters, ChannelAdapters } from "../factories/channel-factory";

function parseBody(req: NodeIncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function json(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

interface CreateHttpServerOptions {
  config: AppConfig;
  adapters?: ChannelAdapters;
  idempotencyStore?: InMemoryIdempotencyStore;
}

function verifyWebhook(req: NodeIncomingMessage, res: ServerResponse, config: AppConfig): boolean {
  const rawUrl = req.url ?? "/";
  const url = new URL(rawUrl, "http://localhost");
  if (req.method !== "GET" || url.pathname !== "/webhooks/whatsapp/direct") {
    return false;
  }

  if (!config.waCloudWebhookVerifyToken) {
    json(res, 500, { error: "WA_CLOUD_WEBHOOK_VERIFY_TOKEN is not configured" });
    return true;
  }

  const mode = url.searchParams.get("hub.mode");
  const verifyToken = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode !== "subscribe" || verifyToken !== config.waCloudWebhookVerifyToken || !challenge) {
    json(res, 403, { error: "Webhook verification failed" });
    return true;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(challenge);
  return true;
}

export function createHttpServer(options: CreateHttpServerOptions): NodeServer {
  const adapters = options.adapters ?? buildChannelAdapters(options.config);
  const idempotencyStore =
    options.idempotencyStore ??
    new InMemoryIdempotencyStore(options.config.directIdempotencyTtlSeconds * 1000);
  const handler = new HandleIncomingMessage(adapters.direct, adapters.groups);

  return createServer(async (req, res) => {
    if (!req.url || !req.method) {
      json(res, 400, { error: "Invalid request" });
      return;
    }

    try {
      if (verifyWebhook(req, res, options.config)) {
        return;
      }

      const requestUrl = new URL(req.url, "http://localhost");

      if (req.method === "GET" && requestUrl.pathname === "/health") {
        const [directHealth, groupHealth] = await Promise.all([
          adapters.direct.healthCheck(),
          adapters.groups.healthCheck()
        ]);

        json(res, 200, {
          app: "ok",
          config: {
            groupAutomationEnabled: options.config.groupAutomationEnabled,
            groupProvider: options.config.groupProvider
          },
          providers: [directHealth, groupHealth]
        });
        return;
      }

      if (req.method === "POST" && requestUrl.pathname === "/webhooks/whatsapp/direct") {
        const payload = await parseBody(req);
        const messages = await adapters.direct.parseWebhook(payload);
        const messagesToProcess = messages.filter((message) => idempotencyStore.markIfNew(message.id));

        await handler.handle(messagesToProcess);

        const duplicates = messages.length - messagesToProcess.length;
        json(res, 200, {
          received: messages.length,
          processed: messagesToProcess.length,
          duplicates
        });
        console.log(
          `[direct-webhook] received=${messages.length} processed=${messagesToProcess.length} duplicates=${duplicates}`
        );
        return;
      }

      if (req.method === "POST" && requestUrl.pathname === "/webhooks/whatsapp/group") {
        const payload = await parseBody(req);
        const messages = await adapters.groups.parseGroupEvent(payload);
        await handler.handle(messages);
        json(res, 200, { accepted: messages.length, provider: adapters.groups.providerName });
        return;
      }

      json(res, 404, { error: "Not found" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      json(res, 500, { error: message });
    }
  });
}

export function startServer(): void {
  const config = loadConfig();
  const adapters = buildChannelAdapters(config);
  const server = createHttpServer({ config, adapters });

  server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
    console.log(
      `Direct provider=${adapters.direct.providerName} | Group provider=${adapters.groups.providerName} | Group automation=${config.groupAutomationEnabled}`
    );
  });
}
