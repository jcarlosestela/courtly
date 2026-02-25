import { GroupMessagingPort } from "../../../domain/ports/group-messaging-port";
import { HealthStatus, IncomingMessage, OutgoingMessage } from "../../../domain/types";

export class BaileysGroupAdapter implements GroupMessagingPort {
  public readonly providerName = "baileys";

  public enabled(): boolean {
    return true;
  }

  public async sendGroup(message: OutgoingMessage): Promise<void> {
    if (!message.groupId) {
      throw new Error("Group message requires groupId");
    }

    // TODO: Implement real Baileys send.
    console.log(`[group:${this.providerName}] -> ${message.groupId}: ${message.text}`);
  }

  public async parseGroupEvent(payload: unknown): Promise<IncomingMessage[]> {
    // TODO: Map real Baileys event payload format.
    const body = payload as {
      id?: string;
      from?: string;
      text?: string;
      groupId?: string;
      timestamp?: string;
    };

    if (!body?.id || !body?.from || !body?.text || !body?.groupId) {
      return [];
    }

    return [
      {
        id: body.id,
        fromPhone: body.from,
        text: body.text,
        channel: "group",
        groupId: body.groupId,
        timestamp: body.timestamp ?? new Date().toISOString()
      }
    ];
  }

  public async healthCheck(): Promise<HealthStatus> {
    return { provider: this.providerName, ok: true };
  }
}
