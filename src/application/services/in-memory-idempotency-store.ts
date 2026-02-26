export class InMemoryIdempotencyStore {
  private readonly seenAt = new Map<string, number>();

  public constructor(private readonly ttlMs: number) {}

  public markIfNew(messageId: string): boolean {
    this.evictExpired();

    if (this.seenAt.has(messageId)) {
      return false;
    }

    this.seenAt.set(messageId, Date.now() + this.ttlMs);
    return true;
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [messageId, expiresAt] of this.seenAt.entries()) {
      if (expiresAt <= now) {
        this.seenAt.delete(messageId);
      }
    }
  }
}
