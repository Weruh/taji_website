import { useEffect, useRef, useState } from 'react'
import ResponsiveImage from './ResponsiveImage.jsx'

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
      className={`relative isolate overflow-hidden ${className}`}
      role="img"
      aria-label={alt}
    >
      {isVisible && (
        <ResponsiveImage
          src={src}
          alt=""
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      )}
      {children}
    </div>
  )
}
