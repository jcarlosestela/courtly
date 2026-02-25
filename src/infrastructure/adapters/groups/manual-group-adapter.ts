import { GroupMessagingPort } from "../../../domain/ports/group-messaging-port";
import { HealthStatus, IncomingMessage, OutgoingMessage } from "../../../domain/types";

export class ManualGroupAdapter implements GroupMessagingPort {
  public readonly providerName = "manual-fallback";

  public enabled(): boolean {
    return false;
  }

  public async sendGroup(message: OutgoingMessage): Promise<void> {
    void message;
    throw new Error("Group automation disabled. Staff must handle groups manually.");
  }

  public async parseGroupEvent(payload: unknown): Promise<IncomingMessage[]> {
    void payload;
    return [];
  }

  public async healthCheck(): Promise<HealthStatus> {
    return {
      provider: this.providerName,
      ok: true,
      details: "Group automation disabled by configuration"
    };
  }
}
