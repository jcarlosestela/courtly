import { DirectMessagingPort } from "../../../domain/ports/direct-messaging-port";
import { HealthStatus, IncomingMessage, OutgoingMessage } from "../../../domain/types";

export class WaCloudApiDirectAdapter implements DirectMessagingPort {
  public readonly providerName = "wa-cloud-api";

  public async sendDirect(message: OutgoingMessage): Promise<void> {
    if (!message.toPhone) {
      throw new Error("Direct message requires toPhone");
    }

    // TODO: Implement real Cloud API call.
    console.log(`[direct:${this.providerName}] -> ${message.toPhone}: ${message.text}`);
  }

  public async parseWebhook(payload: unknown): Promise<IncomingMessage[]> {
    // TODO: Map real Cloud API webhook payload format.
    const body = payload as { id?: string; from?: string; text?: string; timestamp?: string };

    if (!body?.id || !body?.from || !body?.text) {
      return [];
    }

    return [
      {
        id: body.id,
        fromPhone: body.from,
        text: body.text,
        channel: "direct",
        timestamp: body.timestamp ?? new Date().toISOString()
      }
    ];
  }

  public async healthCheck(): Promise<HealthStatus> {
    return { provider: this.providerName, ok: true };
  }
}
