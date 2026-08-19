# hqrtc wire protocol ⚡

Signaling happens over a single WebSocket connection per peer. Every message
is a JSON object, one per frame, encoded/decoded by `src/signal/codec.js`.

## Envelope

Every message has:

- `type` — one of `join`, `offer`, `answer`, `candidate`, `leave`
- `room` — string, the room id (required, must be non-empty)

Directed messages (`offer`, `answer`, `candidate`) also carry:

- `to` — peer id of the intended recipient

## Message types

| type        | direction       | extra fields                     |
|-------------|-----------------|-----------------------------------|
| `join`      | peer -> server  | —                                 |
| `join`      | server -> peer  | `peers` (array of peer ids in room) |
| `offer`     | peer -> peer    | `to`, `sdp` (SDP offer payload)   |
| `answer`    | peer -> peer    | `to`, `sdp` (SDP answer payload)  |
| `candidate` | peer -> peer    | `to`, `candidate` (ICE candidate) |
| `leave`     | peer -> server  | —                                 |

`offer`/`answer`/`candidate` are relayed as-is: the server forwards the full
message to the peer named by `to`, unmodified. If `to` is missing, the
message is silently dropped.

## Example exchange

```
A -> server:  { "type": "join", "room": "r1" }
server -> A:  { "type": "join", "room": "r1", "peers": ["A"] }
B -> server:  { "type": "join", "room": "r1" }
server -> B:  { "type": "join", "room": "r1", "peers": ["A", "B"] }
A -> server:  { "type": "offer", "room": "r1", "to": "B", "sdp": "..." }
server -> B:  { "type": "offer", "room": "r1", "to": "B", "sdp": "..." }
B -> server:  { "type": "answer", "room": "r1", "to": "A", "sdp": "..." }
server -> A:  { "type": "answer", "room": "r1", "to": "A", "sdp": "..." }
```

## Errors

Any message that fails to parse as JSON, isn't an object, has an unknown
`type`, or has a missing/empty `room` is rejected by the codec with an
`Error('bad message')`. The server does not attempt partial recovery — a
bad message should be treated as a fatal protocol violation for that frame.
