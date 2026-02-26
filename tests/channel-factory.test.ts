import { describe, expect, it } from "vitest";
import { AppConfig } from "../src/config/env";
import { buildChannelAdapters } from "../src/infrastructure/factories/channel-factory";

function baseConfig(): AppConfig {
  return {
    port: 3000,
    nodeEnv: "test",
    groupAutomationEnabled: true,
    groupProvider: "baileys",
    waCloudApiBaseUrl: "https://graph.facebook.com",
    waCloudApiVersion: "v22.0",
    waCloudPhoneNumberId: "12345",
    waCloudAccessToken: "token",
    waCloudWebhookVerifyToken: "verify",
    directIdempotencyTtlSeconds: 600
  };
}

describe("buildChannelAdapters", () => {
  it("returns manual group adapter when group automation is disabled", () => {
    const adapters = buildChannelAdapters({
      ...baseConfig(),
      groupAutomationEnabled: false,
      groupProvider: "baileys"
    });

    expect(adapters.direct.providerName).toBe("wa-cloud-api");
    expect(adapters.groups.providerName).toBe("manual-fallback");
    expect(adapters.groups.enabled()).toBe(false);
  });

  it("returns Baileys adapter when enabled and provider is baileys", () => {
    const adapters = buildChannelAdapters({
      ...baseConfig(),
      groupAutomationEnabled: true,
      groupProvider: "baileys"
    });

    expect(adapters.groups.providerName).toBe("baileys");
    expect(adapters.groups.enabled()).toBe(true);
  });

  it("returns official adapter when enabled and provider is official", () => {
    const adapters = buildChannelAdapters({
      ...baseConfig(),
      groupAutomationEnabled: true,
      groupProvider: "official"
    });

    expect(adapters.groups.providerName).toBe("official-group-api");
  });
});
