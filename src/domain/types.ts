export type Channel = "direct" | "group";

export interface IncomingMessage {
  id: string;
  fromPhone: string;
  text: string;
  channel: Channel;
  groupId?: string;
  timestamp: string;
}

export interface OutgoingMessage {
  toPhone?: string;
  groupId?: string;
  text: string;
}

export interface HealthStatus {
  provider: string;
  ok: boolean;
  details?: string;
}
