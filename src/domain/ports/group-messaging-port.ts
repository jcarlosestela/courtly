import { HealthStatus, IncomingMessage, OutgoingMessage } from "../types";

export interface GroupMessagingPort {
  readonly providerName: string;
  enabled(): boolean;
  sendGroup(message: OutgoingMessage): Promise<void>;
  parseGroupEvent(payload: unknown): Promise<IncomingMessage[]>;
  healthCheck(): Promise<HealthStatus>;
}
