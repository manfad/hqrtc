// Wire format for signaling messages: JSON in, validated object out.
const VALID_TYPES = new Set(['join', 'offer', 'answer', 'candidate', 'leave']);

export function encode(msg) {
  return JSON.stringify(msg);
}

export function decode(text) {
  let msg;
  try {
    msg = JSON.parse(text);
  } catch {
    throw new Error('bad message');
  }
  if (!msg || typeof msg !== 'object') throw new Error('bad message');
  if (!VALID_TYPES.has(msg.type)) throw new Error('bad message');
  if (typeof msg.room !== 'string' || msg.room.length === 0) {
    throw new Error('bad message');
  }
  return msg;
}
