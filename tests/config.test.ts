import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config/env";

describe("loadConfig", () => {
  it("uses defaults when env vars are not set", () => {
    const original = { ...process.env };
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.GROUP_AUTOMATION_ENABLED;
    delete process.env.GROUP_PROVIDER;

    const config = loadConfig();

    expect(config.port).toBe(3000);
    expect(config.nodeEnv).toBe("development");
    expect(config.groupAutomationEnabled).toBe(true);
    expect(config.groupProvider).toBe("baileys");
    process.env = original;
  });

  it("reads explicit env vars", () => {
    const original = { ...process.env };
    process.env.PORT = "3010";
    process.env.NODE_ENV = "test";
    process.env.GROUP_AUTOMATION_ENABLED = "false";
    process.env.GROUP_PROVIDER = "manual";

    const config = loadConfig();

    expect(config.port).toBe(3010);
    expect(config.nodeEnv).toBe("test");
    expect(config.groupAutomationEnabled).toBe(false);
    expect(config.groupProvider).toBe("manual");
    process.env = original;
  });
});
