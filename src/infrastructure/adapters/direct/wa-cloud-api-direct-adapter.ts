import { DirectMessagingPort } from "../../../domain/ports/direct-messaging-port";
import { HealthStatus, IncomingMessage, OutgoingMessage } from "../../../domain/types";

interface WaCloudApiConfig {
  apiBaseUrl: string;
  apiVersion: string;
  phoneNumberId?: string;
  accessToken?: string;
}

interface MetaWebhookPayload {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          id?: string;
          from?: string;
          timestamp?: string;
          type?: string;
          text?: { body?: string };
        }>;
      };
    }>;
  }>;
}

export class WaCloudApiDirectAdapter implements DirectMessagingPort {
  public readonly providerName = "wa-cloud-api";

  public constructor(private readonly config: WaCloudApiConfig) {}

  public async sendDirect(message: OutgoingMessage): Promise<void> {
    if (!message.toPhone) {
      throw new Error("Direct message requires toPhone");
    }

    if (!this.config.phoneNumberId) {
      throw new Error("WA_CLOUD_PHONE_NUMBER_ID is required for direct messaging");
    }

    if (!this.config.accessToken) {
      throw new Error("WA_CLOUD_ACCESS_TOKEN is required for direct messaging");
    }

    const normalizedBase = this.config.apiBaseUrl.replace(/\/+$/, "");
    const normalizedVersion = this.config.apiVersion.replace(/^\/+/, "");
    const url = `${normalizedBase}/${normalizedVersion}/${this.config.phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: message.toPhone,
        type: "text",
        text: {
          body: message.text
        }
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `WhatsApp Cloud API send failed (${response.status}): ${body || response.statusText}`
      );
    }
  }

  public async parseWebhook(payload: unknown): Promise<IncomingMessage[]> {
    const body = payload as MetaWebhookPayload;
    const mapped: IncomingMessage[] = [];

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        for (const message of change.value?.messages ?? []) {
          if (
            message.type !== "text" ||
            !message.id ||
            !message.from ||
            !message.text?.body ||
            message.text.body.trim().length === 0
          ) {
            continue;
          }

          mapped.push({
            id: message.id,
            fromPhone: message.from,
            text: message.text.body,
            channel: "direct",
            timestamp: this.mapTimestamp(message.timestamp)
          });
        }
      }
    }

    return mapped;
  }

  public async healthCheck(): Promise<HealthStatus> {
    const configured =
      Boolean(this.config.phoneNumberId) &&
      Boolean(this.config.accessToken) &&
      this.config.apiBaseUrl.length > 0 &&
      this.config.apiVersion.length > 0;

    return {
      provider: this.providerName,
      ok: configured,
      details: configured ? undefined : "Missing WA Cloud API configuration"
    };
  }

  private mapTimestamp(timestamp: string | undefined): string {
    if (!timestamp) {
      return new Date().toISOString();
    }

    const timestampNumber = Number(timestamp);
    if (!Number.isFinite(timestampNumber)) {
      return new Date().toISOString();
    }

    return new Date(timestampNumber * 1000).toISOString();
  }
}
