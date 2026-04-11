import { useEffect, useRef, useState } from 'react'

export default function LazyBackground({ src, className = '', alt = '', priority = false, children = null }) {
  const [isVisible, setIsVisible] = useState(priority)
  const containerRef = useRef(null)

  useEffect(() => {
    if (priority || !containerRef.current) return undefined
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [priority])

  return (
    <div
      ref={containerRef}
      className={className}
      style={isVisible ? { backgroundImage: `url('${src}')` } : undefined}
      role="img"
      aria-label={alt}
    >
      {children}
    </div>
  )
}
