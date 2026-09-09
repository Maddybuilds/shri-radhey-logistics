import { useEffect, useState } from 'react'

/**
 * True on small touch devices (coarse pointer + narrow viewport), where the
 * scroll-driven R3F truck/globe scene would be too heavy. Computed once on mount.
 */
export default function useLowPower() {
  const [low, setLow] = useState(false)
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const small = window.innerWidth <= 768
    setLow(coarse && small)
  }, [])
  return low
}
