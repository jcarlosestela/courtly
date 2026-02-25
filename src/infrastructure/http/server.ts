import { createServer } from "node:http";
import { IncomingMessage as NodeIncomingMessage, ServerResponse } from "node:http";
import { buildChannelAdapters } from "../factories/channel-factory";
import { loadConfig } from "../../config/env";
import { HandleIncomingMessage } from "../../application/use-cases/handle-incoming-message";

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

export function startServer(): void {
  const config = loadConfig();
  const adapters = buildChannelAdapters(config);
  const handler = new HandleIncomingMessage(adapters.direct, adapters.groups);

  const server = createServer(async (req, res) => {
    if (!req.url || !req.method) {
      json(res, 400, { error: "Invalid request" });
      return;
    }

    try {
      if (req.method === "GET" && req.url === "/health") {
        const [directHealth, groupHealth] = await Promise.all([
          adapters.direct.healthCheck(),
          adapters.groups.healthCheck()
        ]);

        json(res, 200, {
          app: "ok",
          config: {
            groupAutomationEnabled: config.groupAutomationEnabled,
            groupProvider: config.groupProvider
          },
          providers: [directHealth, groupHealth]
        });
        return;
      }

      if (req.method === "POST" && req.url === "/webhooks/whatsapp/direct") {
        const payload = await parseBody(req);
        const messages = await adapters.direct.parseWebhook(payload);
        await handler.handle(messages);
        json(res, 200, { accepted: messages.length });
        return;
      }

      if (req.method === "POST" && req.url === "/webhooks/whatsapp/group") {
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

  server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
    console.log(
      `Direct provider=${adapters.direct.providerName} | Group provider=${adapters.groups.providerName} | Group automation=${config.groupAutomationEnabled}`
    );
  });
}
