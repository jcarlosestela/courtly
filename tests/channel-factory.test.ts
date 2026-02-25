import { describe, expect, it } from "vitest";
import { buildChannelAdapters } from "../src/infrastructure/factories/channel-factory";

describe("buildChannelAdapters", () => {
  it("returns manual group adapter when group automation is disabled", () => {
    const adapters = buildChannelAdapters({
      port: 3000,
      nodeEnv: "test",
      groupAutomationEnabled: false,
      groupProvider: "baileys"
    });

    expect(adapters.direct.providerName).toBe("wa-cloud-api");
    expect(adapters.groups.providerName).toBe("manual-fallback");
    expect(adapters.groups.enabled()).toBe(false);
  });

  it("returns Baileys adapter when enabled and provider is baileys", () => {
    const adapters = buildChannelAdapters({
      port: 3000,
      nodeEnv: "test",
      groupAutomationEnabled: true,
      groupProvider: "baileys"
    });

    expect(adapters.groups.providerName).toBe("baileys");
    expect(adapters.groups.enabled()).toBe(true);
  });

  it("returns official adapter when enabled and provider is official", () => {
    const adapters = buildChannelAdapters({
      port: 3000,
      nodeEnv: "test",
      groupAutomationEnabled: true,
      groupProvider: "official"
    });

    expect(adapters.groups.providerName).toBe("official-group-api");
  });
});
