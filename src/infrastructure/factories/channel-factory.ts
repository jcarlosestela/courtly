import { AppConfig } from "../../config/env";
import { DirectMessagingPort } from "../../domain/ports/direct-messaging-port";
import { GroupMessagingPort } from "../../domain/ports/group-messaging-port";
import { WaCloudApiDirectAdapter } from "../adapters/direct/wa-cloud-api-direct-adapter";
import { BaileysGroupAdapter } from "../adapters/groups/baileys-group-adapter";
import { ManualGroupAdapter } from "../adapters/groups/manual-group-adapter";
import { OfficialGroupAdapter } from "../adapters/groups/official-group-adapter";

export interface ChannelAdapters {
  direct: DirectMessagingPort;
  groups: GroupMessagingPort;
}

export function buildChannelAdapters(config: AppConfig): ChannelAdapters {
  const direct = new WaCloudApiDirectAdapter({
    apiBaseUrl: config.waCloudApiBaseUrl,
    apiVersion: config.waCloudApiVersion,
    phoneNumberId: config.waCloudPhoneNumberId,
    accessToken: config.waCloudAccessToken
  });

  if (!config.groupAutomationEnabled) {
    return { direct, groups: new ManualGroupAdapter() };
  }

  switch (config.groupProvider) {
    case "baileys":
      return {
        direct,
        groups: new BaileysGroupAdapter({
          allowedGroupIds: config.groupAllowlist,
          rateLimitPerGroupPerMinute: config.groupRateLimitPerGroupPerMinute,
          rateLimitGlobalPerMinute: config.groupRateLimitGlobalPerMinute,
          sessionPath: config.baileysSessionPath
        })
      };
    case "official":
      return { direct, groups: new OfficialGroupAdapter() };
    case "manual":
    default:
      return { direct, groups: new ManualGroupAdapter() };
  }
}
