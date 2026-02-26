export interface AppConfig {
  port: number;
  nodeEnv: string;
  groupAutomationEnabled: boolean;
  groupProvider: "baileys" | "official" | "manual";
  groupAllowlist: string[];
  groupRateLimitPerGroupPerMinute: number;
  groupRateLimitGlobalPerMinute: number;
  baileysSessionPath: string;
  waCloudApiBaseUrl: string;
  waCloudApiVersion: string;
  waCloudPhoneNumberId?: string;
  waCloudAccessToken?: string;
  waCloudWebhookVerifyToken?: string;
  directIdempotencyTtlSeconds: number;
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function readNumber(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readCsv(value: string | undefined): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function loadConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 3000),
    nodeEnv: process.env.NODE_ENV ?? "development",
    groupAutomationEnabled: readBoolean(process.env.GROUP_AUTOMATION_ENABLED, true),
    groupProvider: (process.env.GROUP_PROVIDER as AppConfig["groupProvider"]) ?? "baileys",
    groupAllowlist: readCsv(process.env.GROUP_ALLOWLIST),
    groupRateLimitPerGroupPerMinute: readNumber(
      process.env.GROUP_RATE_LIMIT_PER_GROUP_PER_MINUTE,
      20
    ),
    groupRateLimitGlobalPerMinute: readNumber(process.env.GROUP_RATE_LIMIT_GLOBAL_PER_MINUTE, 100),
    baileysSessionPath: process.env.BAILEYS_SESSION_PATH ?? ".baileys-session",
    waCloudApiBaseUrl: process.env.WA_CLOUD_API_BASE_URL ?? "https://graph.facebook.com",
    waCloudApiVersion: process.env.WA_CLOUD_API_VERSION ?? "v22.0",
    waCloudPhoneNumberId: process.env.WA_CLOUD_PHONE_NUMBER_ID,
    waCloudAccessToken: process.env.WA_CLOUD_ACCESS_TOKEN,
    waCloudWebhookVerifyToken: process.env.WA_CLOUD_WEBHOOK_VERIFY_TOKEN,
    directIdempotencyTtlSeconds: readNumber(process.env.DIRECT_IDEMPOTENCY_TTL_SECONDS, 24 * 60 * 60)
  };
}
