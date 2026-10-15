// Небольшой детерминированный ГПСЧ, чтобы mock-данные были стабильны
// между перезагрузками страницы (важно для демонстраций).

export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type RNG = () => number;

export function randInt(rng: RNG, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function randFloat(rng: RNG, min: number, max: number, digits = 1): number {
  const v = rng() * (max - min) + min;
  const p = 10 ** digits;
  return Math.round(v * p) / p;
}

export function pick<T>(rng: RNG, arr: readonly T[]): T {
  return arr[randInt(rng, 0, arr.length - 1)];
}

export function pickWeighted<T>(rng: RNG, entries: [T, number][]): T {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rng() * total;
  for (const [value, weight] of entries) {
    r -= weight;
    if (r <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}
