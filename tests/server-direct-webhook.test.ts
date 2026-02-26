import { AddressInfo } from "node:net";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppConfig } from "../src/config/env";
import { DirectMessagingPort } from "../src/domain/ports/direct-messaging-port";
import { GroupMessagingPort } from "../src/domain/ports/group-messaging-port";
import { createHttpServer } from "../src/infrastructure/http/server";

const baseConfig: AppConfig = {
  port: 0,
  nodeEnv: "test",
  groupAutomationEnabled: true,
  groupProvider: "manual",
  groupAllowlist: [],
  groupRateLimitPerGroupPerMinute: 20,
  groupRateLimitGlobalPerMinute: 100,
  baileysSessionPath: ".baileys-session",
  waCloudApiBaseUrl: "https://graph.facebook.com",
  waCloudApiVersion: "v22.0",
  waCloudPhoneNumberId: "123",
  waCloudAccessToken: "token",
  waCloudWebhookVerifyToken: "verify-token",
  directIdempotencyTtlSeconds: 60
};

async function withServer(
  config: AppConfig,
  direct: DirectMessagingPort,
  groups: GroupMessagingPort,
  run: (baseUrl: string) => Promise<void>
): Promise<void> {
  const server = createHttpServer({
    config,
    adapters: { direct, groups }
  });

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as AddressInfo;

  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}

describe("server direct webhook", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns processed/duplicate counters and skips duplicate processing", async () => {
    const directSendSpy = vi.fn().mockResolvedValue(undefined);
    const direct: DirectMessagingPort = {
      providerName: "wa-cloud-api",
      sendDirect: directSendSpy,
      parseWebhook: async (payload: unknown) => {
        const body = payload as { id?: string; from?: string; text?: string };
        if (!body.id || !body.from || !body.text) {
          return [];
        }

        return [
          {
            id: body.id,
            fromPhone: body.from,
            text: body.text,
            channel: "direct",
            timestamp: new Date().toISOString()
          }
        ];
      },
      healthCheck: async () => ({ provider: "wa-cloud-api", ok: true })
    };

    const groups: GroupMessagingPort = {
      providerName: "manual",
      enabled: () => false,
      sendGroup: async () => undefined,
      parseGroupEvent: async () => [],
      healthCheck: async () => ({ provider: "manual", ok: true })
    };

    await withServer(baseConfig, direct, groups, async (baseUrl) => {
      const first = await fetch(`${baseUrl}/webhooks/whatsapp/direct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "wamid.dup", from: "34600111222", text: "hola" })
      });

      expect(first.status).toBe(200);
      await expect(first.json()).resolves.toEqual({
        received: 1,
        processed: 1,
        duplicates: 0
      });

      const second = await fetch(`${baseUrl}/webhooks/whatsapp/direct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "wamid.dup", from: "34600111222", text: "hola" })
      });

      expect(second.status).toBe(200);
      await expect(second.json()).resolves.toEqual({
        received: 1,
        processed: 0,
        duplicates: 1
      });
    });

    expect(directSendSpy).toHaveBeenCalledTimes(1);
  });

  it("verifies webhook challenge with token", async () => {
    const direct: DirectMessagingPort = {
      providerName: "wa-cloud-api",
      sendDirect: async () => undefined,
      parseWebhook: async () => [],
      healthCheck: async () => ({ provider: "wa-cloud-api", ok: true })
    };

    const groups: GroupMessagingPort = {
      providerName: "manual",
      enabled: () => false,
      sendGroup: async () => undefined,
      parseGroupEvent: async () => [],
      healthCheck: async () => ({ provider: "manual", ok: true })
    };

    await withServer(baseConfig, direct, groups, async (baseUrl) => {
      const okResponse = await fetch(
        `${baseUrl}/webhooks/whatsapp/direct?hub.mode=subscribe&hub.verify_token=verify-token&hub.challenge=abc123`
      );
      expect(okResponse.status).toBe(200);
      await expect(okResponse.text()).resolves.toBe("abc123");

      const failedResponse = await fetch(
        `${baseUrl}/webhooks/whatsapp/direct?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=abc123`
      );
      expect(failedResponse.status).toBe(403);
    });
  });

  it("keeps service up with group kill switch enabled", async () => {
    const server = createHttpServer({
      config: {
        ...baseConfig,
        groupAutomationEnabled: false,
        groupProvider: "baileys"
      }
    });

    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address() as AddressInfo;

    try {
      const healthResponse = await fetch(`http://127.0.0.1:${address.port}/health`);
      expect(healthResponse.status).toBe(200);

      await expect(healthResponse.json()).resolves.toMatchObject({
        app: "ok",
        config: {
          groupAutomationEnabled: false,
          groupProvider: "baileys"
        },
        providers: [{ provider: "wa-cloud-api", ok: true }, { provider: "manual-fallback", ok: true }]
      });

      const groupWebhookResponse = await fetch(
        `http://127.0.0.1:${address.port}/webhooks/whatsapp/group`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [] })
        }
      );

      expect(groupWebhookResponse.status).toBe(200);
      await expect(groupWebhookResponse.json()).resolves.toEqual({
        accepted: 0,
        provider: "manual-fallback"
      });
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  });
});
