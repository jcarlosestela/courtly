import { GroupMessagingPort } from "../../../domain/ports/group-messaging-port";
import { HealthStatus, IncomingMessage, OutgoingMessage } from "../../../domain/types";

export class OfficialGroupAdapter implements GroupMessagingPort {
  public readonly providerName = "official-group-api";

  public enabled(): boolean {
    return true;
  }

  public async sendGroup(_message: OutgoingMessage): Promise<void> {
    throw new Error("Official group adapter not implemented yet");
  }

  public async parseGroupEvent(_payload: unknown): Promise<IncomingMessage[]> {
    return [];
  }

  public async healthCheck(): Promise<HealthStatus> {
    return {
      provider: this.providerName,
      ok: false,
      details: "Adapter scaffolded but not implemented"
    };
  }
}
