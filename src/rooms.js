// In-memory room registry: roomId -> Set<peerId>
export class Rooms {
  #rooms = new Map();
  get size() { return this.#rooms.size; }
  join(roomId, peerId) {
    if (!this.#rooms.has(roomId)) this.#rooms.set(roomId, new Set());
    this.#rooms.get(roomId).add(peerId);
    return [...this.#rooms.get(roomId)];
  }
  leave(roomId, peerId) {
    const r = this.#rooms.get(roomId);
    if (!r) return;
    r.delete(peerId);
    if (r.size === 0) this.#rooms.delete(roomId);
  }
}
