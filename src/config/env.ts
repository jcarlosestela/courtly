export interface AppConfig {
  port: number;
  nodeEnv: string;
  groupAutomationEnabled: boolean;
  groupProvider: "baileys" | "official" | "manual";
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

export function loadConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 3000),
    nodeEnv: process.env.NODE_ENV ?? "development",
    groupAutomationEnabled: readBoolean(process.env.GROUP_AUTOMATION_ENABLED, true),
    groupProvider: (process.env.GROUP_PROVIDER as AppConfig["groupProvider"]) ?? "baileys"
  };
}
