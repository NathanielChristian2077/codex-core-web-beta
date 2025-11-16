/**
 * Deterministic pseudo-random integer from a string id.
 * Useful for jitter, offsets, etc.
 */
export function pseudoRandomFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
