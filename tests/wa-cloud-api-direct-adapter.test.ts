import { afterEach, describe, expect, it, vi } from "vitest";
import { WaCloudApiDirectAdapter } from "../src/infrastructure/adapters/direct/wa-cloud-api-direct-adapter";

describe("WaCloudApiDirectAdapter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends direct messages to WhatsApp Cloud API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);

    const adapter = new WaCloudApiDirectAdapter({
      apiBaseUrl: "https://graph.facebook.com",
      apiVersion: "v22.0",
      phoneNumberId: "555",
      accessToken: "secret"
    });

    await adapter.sendDirect({ toPhone: "34600111222", text: "hola" });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://graph.facebook.com/v22.0/555/messages",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer secret",
          "Content-Type": "application/json"
        }
      })
    );
  });

  it("throws actionable error when API send fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        text: vi.fn().mockResolvedValue('{"error":"invalid token"}')
      })
    );

    const adapter = new WaCloudApiDirectAdapter({
      apiBaseUrl: "https://graph.facebook.com",
      apiVersion: "v22.0",
      phoneNumberId: "555",
      accessToken: "secret"
    });

    await expect(adapter.sendDirect({ toPhone: "34600111222", text: "hola" })).rejects.toThrow(
      "WhatsApp Cloud API send failed (401)"
    );
  });

  it("maps text messages from Meta webhook payload", async () => {
    const adapter = new WaCloudApiDirectAdapter({
      apiBaseUrl: "https://graph.facebook.com",
      apiVersion: "v22.0",
      phoneNumberId: "555",
      accessToken: "secret"
    });

    const messages = await adapter.parseWebhook({
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    id: "wamid.abc",
                    from: "34600111222",
                    timestamp: "1730000000",
                    type: "text",
                    text: { body: "Hola" }
                  },
                  {
                    id: "wamid.no-text",
                    from: "34600111222",
                    type: "image"
                  }
                ]
              }
            }
          ]
        }
      ]
    });

    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
      id: "wamid.abc",
      fromPhone: "34600111222",
      text: "Hola",
      channel: "direct"
    });
  });
});
