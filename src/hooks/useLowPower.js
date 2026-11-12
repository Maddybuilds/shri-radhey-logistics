import { useEffect, useState } from 'react'

/**
 * Use a lighter render budget on compact touch devices. Keep the full scene
 * available and update its quality when the viewport or input device changes.
 */
export default function useLowPower() {
  const query = '(pointer: coarse) and (max-width: 1024px)'
  const [low, setLow] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setLow(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return low
}
