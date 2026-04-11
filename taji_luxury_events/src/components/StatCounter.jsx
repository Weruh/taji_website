import { useEffect, useRef, useState } from 'react'

const parseValue = (value) => {
  const digits = parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0
  const suffix = String(value).replace(/[0-9]/g, '')
  return { digits, suffix }
}

export default function StatCounter({ value, label }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const target = ref.current
    if (!target) return undefined
    const { digits, suffix } = parseValue(value)
    const start = () => {
      if (startedRef.current) return
      startedRef.current = true
      const startTime = performance.now()
      const duration = 1200
      const step = (time) => {
        const progress = Math.min((time - startTime) / duration, 1)
        const nextValue = Math.floor(progress * digits)
        setDisplay(`${nextValue}${suffix}`)
        if (progress < 1) window.requestAnimationFrame(step)
      }
      window.requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-center px-6 py-4">
      <p className="text-3xl md:text-4xl font-playfair text-gold">{display}</p>
      <p className="stat-label text-xs uppercase text-mist/70 mt-2">{label}</p>
    </div>
  )
}
