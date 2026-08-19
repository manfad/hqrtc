# hqrtc ⚡

A toy WebRTC **signaling** server. Peers join a room, exchange SDP offers/answers
and ICE candidates through a tiny relay — nothing more.

## Layout

```
src/
  server.js   entry point: HTTP + WebSocket listener
  rooms.js    in-memory room registry
  signal/     message codec + router (offer / answer / candidate)
docs/
  PROTOCOL.md wire protocol
test/
```

## Run

```sh
node src/server.js
```

## Status

Signaling core, protocol doc and tests are in; ICE lives on `feat/ice`.
