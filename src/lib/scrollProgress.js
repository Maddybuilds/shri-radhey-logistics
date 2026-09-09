// Independent read of the 3D experience's scroll progress (0..1), mirroring the
// existing ScrollTrigger mapping (trigger=.scroll-root, start top top, end bottom
// bottom). Reading this does NOT touch the GSAP master timeline or the anim ref.
export function getScrollProgress() {
  const root = document.querySelector('.scroll-root')
  if (!root) return 0
  const denom = root.offsetHeight - window.innerHeight
  if (denom <= 0) return 0
  return Math.min(1, Math.max(0, window.scrollY / denom))
}

/**
 * Trapezoidal envelope: 0 before `a`, ramps 0→1 over a..b, holds 1 over b..c,
 * ramps 1→0 over c..d, 0 after. Use a<0 to start fully visible.
 */
export function band(p, a, b, c, d) {
  if (p <= a || p >= d) return 0
  if (p < b) return (p - a) / (b - a)
  if (p <= c) return 1
  return (d - p) / (d - c)
}
