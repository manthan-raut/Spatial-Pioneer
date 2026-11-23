// Shared geometry helpers used by the SVG map illustrations.

export const BASE = { lat: 21.1458, lon: 79.0882 }; // placeholder origin (central India) — change to HQ

/** Deterministic PRNG so generated maps look the same on every render. */
export function mulberry(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Closed wobbly ring — looks like a contour line around a hill. */
export function ringPath(cx, cy, r, s, n = 90, ax = 1, ay = 1) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 + 0.13 * Math.sin(3 * a + s) + 0.07 * Math.sin(5 * a + s * 2.1) + 0.04 * Math.sin(8 * a + s * 0.7));
    d += (i ? "L" : "M") + (cx + Math.cos(a) * rr * ax).toFixed(1) + " " + (cy + Math.sin(a) * rr * ay).toFixed(1);
  }
  return d + "Z";
}

/** Boustrophedon ("lawnmower") flight path inside a rectangle. */
export function lawnmower(x0, y0, w, h, lanes) {
  const step = lanes > 1 ? h / (lanes - 1) : 0;
  let d = `M${x0} ${y0}`;
  for (let i = 0; i < lanes; i++) {
    const y = y0 + i * step;
    const xe = i % 2 ? x0 : x0 + w;
    d += ` L${xe.toFixed(1)} ${y.toFixed(1)}`;
    if (i < lanes - 1) d += ` L${xe.toFixed(1)} ${(y + step).toFixed(1)}`;
  }
  return d;
}

export const fmtLat = (v) => `${Math.abs(v).toFixed(5)}°${v >= 0 ? "N" : "S"}`;
export const fmtLon = (v) => `${Math.abs(v).toFixed(5)}°${v >= 0 ? "E" : "W"}`;
