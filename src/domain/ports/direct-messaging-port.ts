import { HealthStatus, IncomingMessage, OutgoingMessage } from "../types";

export interface DirectMessagingPort {
  readonly providerName: string;
  sendDirect(message: OutgoingMessage): Promise<void>;
  parseWebhook(payload: unknown): Promise<IncomingMessage[]>;
  healthCheck(): Promise<HealthStatus>;
}
