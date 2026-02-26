import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config/env";

describe("loadConfig", () => {
  it("uses defaults when env vars are not set", () => {
    const original = { ...process.env };
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.GROUP_AUTOMATION_ENABLED;
    delete process.env.GROUP_PROVIDER;
    delete process.env.WA_CLOUD_API_BASE_URL;
    delete process.env.WA_CLOUD_API_VERSION;
    delete process.env.WA_CLOUD_PHONE_NUMBER_ID;
    delete process.env.WA_CLOUD_ACCESS_TOKEN;
    delete process.env.WA_CLOUD_WEBHOOK_VERIFY_TOKEN;
    delete process.env.DIRECT_IDEMPOTENCY_TTL_SECONDS;

    const config = loadConfig();

    expect(config.port).toBe(3000);
    expect(config.nodeEnv).toBe("development");
    expect(config.groupAutomationEnabled).toBe(true);
    expect(config.groupProvider).toBe("baileys");
    expect(config.waCloudApiBaseUrl).toBe("https://graph.facebook.com");
    expect(config.waCloudApiVersion).toBe("v22.0");
    expect(config.directIdempotencyTtlSeconds).toBe(86400);
    process.env = original;
  });

  it("reads explicit env vars", () => {
    const original = { ...process.env };
    process.env.PORT = "3010";
    process.env.NODE_ENV = "test";
    process.env.GROUP_AUTOMATION_ENABLED = "false";
    process.env.GROUP_PROVIDER = "manual";
    process.env.WA_CLOUD_API_BASE_URL = "https://graph.facebook.com";
    process.env.WA_CLOUD_API_VERSION = "v23.0";
    process.env.WA_CLOUD_PHONE_NUMBER_ID = "12345";
    process.env.WA_CLOUD_ACCESS_TOKEN = "token";
    process.env.WA_CLOUD_WEBHOOK_VERIFY_TOKEN = "verify";
    process.env.DIRECT_IDEMPOTENCY_TTL_SECONDS = "600";

    const config = loadConfig();

    expect(config.port).toBe(3010);
    expect(config.nodeEnv).toBe("test");
    expect(config.groupAutomationEnabled).toBe(false);
    expect(config.groupProvider).toBe("manual");
    expect(config.waCloudApiVersion).toBe("v23.0");
    expect(config.waCloudPhoneNumberId).toBe("12345");
    expect(config.waCloudAccessToken).toBe("token");
    expect(config.waCloudWebhookVerifyToken).toBe("verify");
    expect(config.directIdempotencyTtlSeconds).toBe(600);
    process.env = original;
  });
});
