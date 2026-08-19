// hqrtc — toy signaling server entry point.
import { createServer } from 'node:http';
import { Rooms } from './rooms.js';

const rooms = new Rooms();
const port = Number(process.env.PORT ?? 8787);

createServer((req, res) => {
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ ok: true, rooms: rooms.size }));
}).listen(port, () => console.log(`hqrtc signaling on :${port}`));
