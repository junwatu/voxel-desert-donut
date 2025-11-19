// A simple, self-contained noise implementation to avoid external dependencies for this demo.
// Based on standard permutation table noise algorithms.

const PERM_SIZE = 256;
const perm = new Uint8Array(PERM_SIZE * 2);

// Initialize with a random seed
const seed = 1337;
const random = (seed: number) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

for (let i = 0; i < PERM_SIZE; i++) {
  perm[i] = i;
}

for (let i = 0; i < PERM_SIZE; i++) {
  const r = Math.floor(random(seed + i) * PERM_SIZE);
  const swap = perm[i];
  perm[i] = perm[r];
  perm[r] = swap;
  perm[i + 256] = perm[i];
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t: number, a: number, b: number) {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number, z: number) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

export function noise2D(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;

  x -= Math.floor(x);
  y -= Math.floor(y);

  const u = fade(x);
  const v = fade(y);

  const A = perm[X] + Y;
  const AA = perm[A];
  const AB = perm[A + 1];
  const B = perm[X + 1] + Y;
  const BA = perm[B];
  const BB = perm[B + 1];

  return lerp(
    v,
    lerp(u, grad(perm[AA], x, y, 0), grad(perm[BA], x - 1, y, 0)),
    lerp(u, grad(perm[AB], x, y - 1, 0), grad(perm[BB], x - 1, y - 1, 0))
  );
}

// Fractal Brownian Motion for more detail
export function fbm(x: number, z: number, octaves: number = 3, persistence: number = 0.5, lacunarity: number = 2) {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += noise2D(x * frequency, z * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return total / maxValue;
}