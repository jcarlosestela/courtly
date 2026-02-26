import { GroupMessagingPort } from "../../../domain/ports/group-messaging-port";
import { HealthStatus, IncomingMessage, OutgoingMessage } from "../../../domain/types";

interface BaileysGroupAdapterOptions {
  allowedGroupIds?: string[];
  rateLimitPerGroupPerMinute?: number;
  rateLimitGlobalPerMinute?: number;
  sessionPath?: string;
  transportFactory?: (sessionPath: string) => Promise<BaileysTransport>;
}

interface BaileysTransport {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendText(groupId: string, text: string): Promise<void>;
  isConnected(): boolean;
}

interface BaileysMessageEvent {
  messages?: Array<{
    key?: {
      id?: string;
      remoteJid?: string;
      participant?: string;
      fromMe?: boolean;
    };
    messageTimestamp?: number | string;
    message?: {
      conversation?: string;
      extendedTextMessage?: { text?: string };
    };
  }>;
}

class DefaultBaileysTransport implements BaileysTransport {
  private socket: {
    sendMessage: (jid: string, content: { text: string }) => Promise<unknown>;
    ev?: {
      on: (event: string, handler: (payload: unknown) => void) => void;
    };
    end?: () => void;
  } | null = null;

  private connected = false;

  public constructor(private readonly sessionPath: string) {}

  public async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    const loaded = await this.loadBaileysModule();

    const authResult = await loaded.useMultiFileAuthState(this.sessionPath);
    const socket = loaded.makeWASocket({
      auth: authResult.state,
      printQRInTerminal: true
    });

    socket.ev?.on("creds.update", authResult.saveCreds);

    socket.ev?.on("connection.update", (update: unknown) => {
      const state = update as { connection?: string };
      if (state.connection === "open") {
        this.connected = true;
      }

      if (state.connection === "close") {
        this.connected = false;
      }
    });

    this.socket = socket;
    this.connected = true;
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
    this.socket?.end?.();
    this.socket = null;
  }

  public async sendText(groupId: string, text: string): Promise<void> {
    if (!this.connected || !this.socket) {
      throw new Error("Baileys session is not connected");
    }

    await this.socket.sendMessage(groupId, { text });
  }

  public isConnected(): boolean {
    return this.connected;
  }

  private async loadBaileysModule(): Promise<{
    makeWASocket: (config: Record<string, unknown>) => {
      sendMessage: (jid: string, content: { text: string }) => Promise<unknown>;
      ev?: {
        on: (event: string, handler: (payload: unknown) => void) => void;
      };
      end?: () => void;
    };
    useMultiFileAuthState: (path: string) => Promise<{
      state: Record<string, unknown>;
      saveCreds: () => Promise<void>;
    }>;
  }> {
    let moduleValue: unknown;

    try {
      const modulePath = "@whiskeysockets/baileys";
      moduleValue = await import(modulePath);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown import error";
      throw new Error(
        `Baileys package is not available. Install @whiskeysockets/baileys to enable group automation. (${message})`
      );
    }

    const typed = moduleValue as {
      default?: (config: Record<string, unknown>) => unknown;
      makeWASocket?: (config: Record<string, unknown>) => unknown;
      useMultiFileAuthState?: (path: string) => unknown;
    };

    const makeWASocketRaw = typed.default ?? typed.makeWASocket;
    const useMultiFileAuthStateRaw = typed.useMultiFileAuthState;

    if (typeof makeWASocketRaw !== "function" || typeof useMultiFileAuthStateRaw !== "function") {
      throw new Error("Baileys module does not expose expected APIs");
    }

    return {
      makeWASocket: makeWASocketRaw as (
        config: Record<string, unknown>
      ) => {
        sendMessage: (jid: string, content: { text: string }) => Promise<unknown>;
        ev?: {
          on: (event: string, handler: (payload: unknown) => void) => void;
        };
        end?: () => void;
      },
      useMultiFileAuthState: useMultiFileAuthStateRaw as (path: string) => Promise<{
        state: Record<string, unknown>;
        saveCreds: () => Promise<void>;
      }>
    };
  }
}

export class BaileysGroupAdapter implements GroupMessagingPort {
  public readonly providerName = "baileys";

  private readonly allowedGroupIds: Set<string>;
  private readonly perGroupWindow: Map<string, number[]> = new Map();
  private readonly globalWindow: number[] = [];
  private readonly rateLimitPerGroupPerMinute: number;
  private readonly rateLimitGlobalPerMinute: number;
  private readonly sessionPath: string;
  private readonly transportFactory: (sessionPath: string) => Promise<BaileysTransport>;

  private transport: BaileysTransport | null = null;
  private connectingPromise: Promise<void> | null = null;
  private lastConnectionError: string | null = null;

  public constructor(options?: BaileysGroupAdapterOptions) {
    this.allowedGroupIds = new Set(
      (options?.allowedGroupIds ?? []).map((groupId) => this.normalizeGroupId(groupId))
    );
    this.rateLimitPerGroupPerMinute = options?.rateLimitPerGroupPerMinute ?? 20;
    this.rateLimitGlobalPerMinute = options?.rateLimitGlobalPerMinute ?? 100;
    this.sessionPath = options?.sessionPath ?? ".baileys-session";
    this.transportFactory =
      options?.transportFactory ?? (async (sessionPath) => new DefaultBaileysTransport(sessionPath));
  }

  public enabled(): boolean {
    return true;
  }

  public async sendGroup(message: OutgoingMessage): Promise<void> {
    if (!message.groupId) {
      throw new Error("Group message requires groupId");
    }

    const groupId = this.normalizeGroupId(message.groupId);
    this.assertGroupAllowed(groupId);
    this.assertRateLimit(groupId);

    await this.ensureConnected();

    if (!this.transport) {
      throw new Error("Baileys transport is not initialized");
    }

    await this.transport.sendText(groupId, message.text);
  }

  public async parseGroupEvent(payload: unknown): Promise<IncomingMessage[]> {
    const body = payload as BaileysMessageEvent;

    const mapped: IncomingMessage[] = [];

    for (const event of body.messages ?? []) {
      const id = event.key?.id;
      const fromMe = event.key?.fromMe ?? false;
      const groupIdRaw = event.key?.remoteJid;
      const participantRaw = event.key?.participant;
      const text =
        event.message?.conversation?.trim() ?? event.message?.extendedTextMessage?.text?.trim();

      if (!id || fromMe || !groupIdRaw || !participantRaw || !text) {
        continue;
      }

      const groupId = this.normalizeGroupId(groupIdRaw);
      if (!groupId.endsWith("@g.us")) {
        continue;
      }

      if (!this.isGroupAllowed(groupId)) {
        continue;
      }

      mapped.push({
        id,
        fromPhone: this.normalizePhoneJid(participantRaw),
        text,
        channel: "group",
        groupId,
        timestamp: this.mapTimestamp(event.messageTimestamp)
      });
    }

    return mapped;
  }

  public async healthCheck(): Promise<HealthStatus> {
    await this.ensureConnected().catch((error: unknown) => {
      this.lastConnectionError =
        error instanceof Error ? error.message : "Unknown Baileys connection error";
    });

    return {
      provider: this.providerName,
      ok: Boolean(this.transport?.isConnected()),
      details: this.healthDetails()
    };
  }

  private healthDetails(): string {
    if (this.lastConnectionError) {
      return `Baileys connection error: ${this.lastConnectionError}`;
    }

    if (this.allowedGroupIds.size === 0) {
      return "Baileys connected without allowlisted groups. Configure GROUP_ALLOWLIST to process messages.";
    }

    return `Allowlisted groups=${this.allowedGroupIds.size}, per-group-per-minute=${this.rateLimitPerGroupPerMinute}, global-per-minute=${this.rateLimitGlobalPerMinute}`;
  }

  private async ensureConnected(): Promise<void> {
    if (this.transport?.isConnected()) {
      return;
    }

    if (this.connectingPromise) {
      await this.connectingPromise;
      return;
    }

    this.connectingPromise = this.connectInternal();

    try {
      await this.connectingPromise;
    } finally {
      this.connectingPromise = null;
    }
  }

  private async connectInternal(): Promise<void> {
    if (!this.transport) {
      this.transport = await this.transportFactory(this.sessionPath);
    }

    try {
      await this.transport.connect();
      this.lastConnectionError = null;
    } catch (error) {
      this.lastConnectionError =
        error instanceof Error ? error.message : "Unknown Baileys connection error";
      await this.transport.disconnect().catch(() => undefined);
      throw error;
    }
  }

  private assertGroupAllowed(groupId: string): void {
    if (this.isGroupAllowed(groupId)) {
      return;
    }

    throw new Error(`Group ${groupId} is not in GROUP_ALLOWLIST`);
  }

  private isGroupAllowed(groupId: string): boolean {
    return this.allowedGroupIds.has(groupId);
  }

  private assertRateLimit(groupId: string): void {
    const now = Date.now();
    const oneMinuteAgo = now - 60_000;

    const groupWindow = (this.perGroupWindow.get(groupId) ?? []).filter(
      (timestamp) => timestamp > oneMinuteAgo
    );
    const globalWindow = this.globalWindow.filter((timestamp) => timestamp > oneMinuteAgo);

    if (groupWindow.length >= this.rateLimitPerGroupPerMinute) {
      throw new Error(
        `Rate limit exceeded for ${groupId}: max ${this.rateLimitPerGroupPerMinute} messages/minute`
      );
    }

    if (globalWindow.length >= this.rateLimitGlobalPerMinute) {
      throw new Error(
        `Global rate limit exceeded: max ${this.rateLimitGlobalPerMinute} group messages/minute`
      );
    }

    groupWindow.push(now);
    globalWindow.push(now);

    this.perGroupWindow.set(groupId, groupWindow);
    this.globalWindow.length = 0;
    this.globalWindow.push(...globalWindow);
  }

  private normalizeGroupId(groupId: string): string {
    const trimmed = groupId.trim();

    if (trimmed.endsWith("@g.us")) {
      return trimmed;
    }

    return `${trimmed}@g.us`;
  }

  private normalizePhoneJid(raw: string): string {
    const baseWithDevice = raw.split("@")[0] ?? raw;
    const base = baseWithDevice.split(":")[0] ?? baseWithDevice;
    return base.replace(/[^0-9]/g, "") || base;
  }

  private mapTimestamp(timestamp: string | number | undefined): string {
    if (timestamp === undefined) {
      return new Date().toISOString();
    }

    const parsed = Number(timestamp);
    if (!Number.isFinite(parsed)) {
      return new Date().toISOString();
    }

    return new Date(parsed * 1000).toISOString();
  }
}
