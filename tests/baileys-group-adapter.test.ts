import { describe, expect, it } from "vitest";
import { BaileysGroupAdapter } from "../src/infrastructure/adapters/groups/baileys-group-adapter";

interface MockTransport {
  connectCalls: number;
  disconnectCalls: number;
  sent: Array<{ groupId: string; text: string }>;
}

function buildAdapter(options?: {
  allowedGroupIds?: string[];
  rateLimitPerGroupPerMinute?: number;
  rateLimitGlobalPerMinute?: number;
}) {
  const state: MockTransport = {
    connectCalls: 0,
    disconnectCalls: 0,
    sent: []
  };

  const adapter = new BaileysGroupAdapter({
    allowedGroupIds: options?.allowedGroupIds ?? ["120363043210@g.us"],
    rateLimitPerGroupPerMinute: options?.rateLimitPerGroupPerMinute ?? 2,
    rateLimitGlobalPerMinute: options?.rateLimitGlobalPerMinute ?? 3,
    transportFactory: async () => ({
      connect: async () => {
        state.connectCalls += 1;
      },
      disconnect: async () => {
        state.disconnectCalls += 1;
      },
      sendText: async (groupId: string, text: string) => {
        state.sent.push({ groupId, text });
      },
      isConnected: () => true
    })
  });

  return { adapter, state };
}

describe("BaileysGroupAdapter", () => {
  it("parses Baileys group messages and normalizes sender", async () => {
    const { adapter } = buildAdapter();

    const parsed = await adapter.parseGroupEvent({
      messages: [
        {
          key: {
            id: "BAE51234",
            remoteJid: "120363043210@g.us",
            participant: "34699111222:17@s.whatsapp.net",
            fromMe: false
          },
          messageTimestamp: 1_740_000_000,
          message: {
            extendedTextMessage: { text: "quiero apuntarme" }
          }
        }
      ]
    });

    expect(parsed).toEqual([
      {
        id: "BAE51234",
        fromPhone: "34699111222",
        text: "quiero apuntarme",
        channel: "group",
        groupId: "120363043210@g.us",
        timestamp: "2025-02-19T21:20:00.000Z"
      }
    ]);
  });

  it("ignores events from non-allowlisted groups", async () => {
    const { adapter } = buildAdapter({ allowedGroupIds: ["120363043210@g.us"] });

    const parsed = await adapter.parseGroupEvent({
      messages: [
        {
          key: {
            id: "BAE59999",
            remoteJid: "120399988877@g.us",
            participant: "34699111222@s.whatsapp.net",
            fromMe: false
          },
          message: {
            conversation: "hola"
          }
        }
      ]
    });

    expect(parsed).toEqual([]);
  });

  it("blocks sends to groups outside allowlist", async () => {
    const { adapter } = buildAdapter({ allowedGroupIds: ["120363043210@g.us"] });

    await expect(
      adapter.sendGroup({
        groupId: "120399988877@g.us",
        text: "mensaje"
      })
    ).rejects.toThrow("is not in GROUP_ALLOWLIST");
  });

  it("enforces per-group rate limit", async () => {
    const { adapter, state } = buildAdapter({
      allowedGroupIds: ["120363043210@g.us"],
      rateLimitPerGroupPerMinute: 1,
      rateLimitGlobalPerMinute: 5
    });

    await adapter.sendGroup({ groupId: "120363043210@g.us", text: "msg 1" });

    await expect(
      adapter.sendGroup({
        groupId: "120363043210@g.us",
        text: "msg 2"
      })
    ).rejects.toThrow("Rate limit exceeded");

    expect(state.connectCalls).toBe(1);
    expect(state.sent).toEqual([{ groupId: "120363043210@g.us", text: "msg 1" }]);
  });
});
