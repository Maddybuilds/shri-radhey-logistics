import { useEffect, useRef, useState } from 'react'

/**
 * Counts from 0 to `target` once `active` becomes true (ease-out cubic).
 * Returns the current numeric value; format at the call site.
 */
export default function useCountUp(target, active, duration = 1500) {
  const [val, setVal] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    started.current = true
    const start = performance.now()
    let raf
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => raf && cancelAnimationFrame(raf)
  }, [active, target, duration])

  return val
}
