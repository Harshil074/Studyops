import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export function useCountUp(target, { duration = 800, decimals = 0 } = {}) {
  const [value, setValue] = useState(0)
  const fromRef = useRef(0)
  const frameRef = useRef(null)

  useEffect(() => {
    const from = fromRef.current
    const to = Number(target) || 0
    const start = performance.now()

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = easeOutCubic(progress)
      const current = from + (to - from) * eased
      setValue(current)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return Number(value.toFixed(decimals))
}
