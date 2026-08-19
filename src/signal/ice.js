// ICE stub: normalise candidate payloads before relaying.
export function normalizeCandidate(c) {
  if (!c || typeof c.candidate !== 'string') throw new Error('bad candidate');
  return { candidate: c.candidate, sdpMid: c.sdpMid ?? null, sdpMLineIndex: c.sdpMLineIndex ?? 0 };
}

export function isRelay(c) {
  return /\btyp relay\b/.test(c.candidate);
}
