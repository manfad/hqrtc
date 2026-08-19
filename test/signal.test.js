import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encode, decode } from '../src/signal/codec.js';
import { Router } from '../src/signal/router.js';
import { Rooms } from '../src/rooms.js';

test('codec round-trip', () => {
  const msg = { type: 'join', room: 'r1' };
  assert.deepEqual(decode(encode(msg)), msg);
});

test('decode rejects bad type', () => {
  assert.throws(() => decode(encode({ type: 'nope', room: 'r1' })), /bad message/);
});

test('decode rejects empty room', () => {
  assert.throws(() => decode(encode({ type: 'join', room: '' })), /bad message/);
});

test('decode rejects malformed JSON', () => {
  assert.throws(() => decode('{not json'), /bad message/);
});

test("Router 'join' sends peer list back", () => {
  const router = new Router(new Rooms());
  const sent = [];
  const send = (to, msg) => sent.push([to, msg]);

  router.handle('A', { type: 'join', room: 'r1' }, send);
  assert.deepEqual(sent, [['A', { type: 'join', room: 'r1', peers: ['A'] }]]);
});

test("Router 'offer' forwarded to msg.to", () => {
  const router = new Router(new Rooms());
  const sent = [];
  const send = (to, msg) => sent.push([to, msg]);

  const offer = { type: 'offer', room: 'r1', to: 'B', sdp: 'v=0...' };
  router.handle('A', offer, send);
  assert.deepEqual(sent, [['B', offer]]);
});

test("Router 'candidate' with no 'to' is dropped", () => {
  const router = new Router(new Rooms());
  const sent = [];
  const send = (to, msg) => sent.push([to, msg]);

  router.handle('A', { type: 'candidate', room: 'r1', candidate: {} }, send);
  assert.deepEqual(sent, []);
});
