import { GroupMessagingPort } from "../../../domain/ports/group-messaging-port";
import { HealthStatus, IncomingMessage, OutgoingMessage } from "../../../domain/types";

export class ManualGroupAdapter implements GroupMessagingPort {
  public readonly providerName = "manual-fallback";

  public enabled(): boolean {
    return false;
  }

  public async sendGroup(_message: OutgoingMessage): Promise<void> {
    throw new Error("Group automation disabled. Staff must handle groups manually.");
  }

  public async parseGroupEvent(_payload: unknown): Promise<IncomingMessage[]> {
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
