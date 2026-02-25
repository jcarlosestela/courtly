import { DirectMessagingPort } from "../../domain/ports/direct-messaging-port";
import { GroupMessagingPort } from "../../domain/ports/group-messaging-port";
import { IncomingMessage } from "../../domain/types";

export class HandleIncomingMessage {
  public constructor(
    private readonly directPort: DirectMessagingPort,
    private readonly groupPort: GroupMessagingPort
  ) {}

  public async handle(messages: IncomingMessage[]): Promise<void> {
    for (const message of messages) {
      if (message.channel === "direct") {
        await this.directPort.sendDirect({
          toPhone: message.fromPhone,
          text: `Recibido: ${message.text}`
        });
        continue;
      }

      if (!this.groupPort.enabled()) {
        console.log("Group automation disabled. Message ignored and should be managed manually.");
        continue;
      }

      await this.groupPort.sendGroup({
        groupId: message.groupId,
        text: `Mensaje de grupo procesado: ${message.text}`
      });
    }
  }
}
