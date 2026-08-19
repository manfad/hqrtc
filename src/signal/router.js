// Routes decoded signaling messages between peers within rooms.
export class Router {
  #rooms;

  constructor(rooms) {
    this.#rooms = rooms;
  }

  handle(peerId, msg, send) {
    switch (msg.type) {
      case 'join': {
        const peers = this.#rooms.join(msg.room, peerId);
        send(peerId, { type: 'join', room: msg.room, peers });
        break;
      }
      case 'leave':
        this.#rooms.leave(msg.room, peerId);
        break;
      case 'offer':
      case 'answer':
      case 'candidate':
        if (msg.to) send(msg.to, msg);
        break;
      default:
        throw new Error('bad message');
    }
  }
}
