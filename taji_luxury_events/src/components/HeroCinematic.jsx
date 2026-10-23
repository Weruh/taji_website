import { useEffect, useMemo, useState } from 'react'
import ResponsiveImage from './ResponsiveImage.jsx'

export default function HeroCinematic({ slides = [], fallbackSlides = [] }) {
  const mediaSlides = useMemo(() => {
    const sources = slides.length ? slides : fallbackSlides
    return sources.map((src, index) => ({
      src,
      alt: `Taji experience frame ${index + 1}`,
    }))
  }, [slides, fallbackSlides])

  const [offset, setOffset] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [playVideo, setPlayVideo] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const [loadedSlides, setLoadedSlides] = useState(() => (mediaSlides.length ? new Set([0]) : new Set()))

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.12)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mediaSlides.length <= 1) return undefined
    const intervalId = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mediaSlides.length)
    }, 5000)
    return () => window.clearInterval(intervalId)
  }, [mediaSlides.length])

  useEffect(() => {
    if (!mediaSlides.length) return
    setLoadedSlides(new Set([0]))
  }, [mediaSlides.length])

  useEffect(() => {
    if (!mediaSlides.length) return
    setLoadedSlides((prev) => new Set(prev).add(currentSlide))
    if (!heroReady) return
    const timeoutId = window.setTimeout(() => {
      setLoadedSlides((prev) => new Set(prev).add((currentSlide + 1) % mediaSlides.length))
    }, 1500)
    return () => window.clearTimeout(timeoutId)
  }, [currentSlide, mediaSlides.length, heroReady])

  useEffect(() => {
    if (!heroReady) return
    const connection = navigator.connection
    if (connection?.saveData || /(^|-)2g|3g/.test(connection?.effectiveType || '') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let idleId
    const timeoutId = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(() => setPlayVideo(true), { timeout: 1500 })
      } else {
        setPlayVideo(true)
      }
    }, 3000)
    return () => {
      window.clearTimeout(timeoutId)
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
    }
  }, [heroReady])

  return (
    <section className="relative min-h-[720px] overflow-hidden text-black">
      <div className="absolute inset-0" aria-hidden="true" style={{ transform: `translate3d(0, ${offset * -0.4}px, 0)` }}>
        <ResponsiveImage
          src="/img/hero/ZWSVicoxm3oCiSi2KqrMn.webp"
          alt=""
          sizes="100vw"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={playVideo ? '/img/hero/fHXSGE07H8SCQHCnKssbf_output.mp4' : undefined}
          autoPlay={playVideo}
          muted
          loop
          playsInline
          preload={playVideo ? 'auto' : 'none'}
        />
        <div className="absolute inset-0">
          {mediaSlides.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-linear ${
                index === currentSlide ? 'opacity-80 mix-blend-screen' : 'opacity-0'
              }`}
            >
              {loadedSlides.has(index) && (
                <ResponsiveImage
                  src={slide.src}
                  alt=""
                  sizes="100vw"
                  className="h-full w-full object-cover"
                  loading="eager"
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  onLoad={index === 0 ? () => setHeroReady(true) : undefined}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-charcoal/80 via-charcoal/50 to-charcoal/20"></div>
      <div className="absolute inset-0 sparkle-layer pointer-events-none"></div>

      <div className="relative z-10">
        <div className="max-w-7xl px-3 sm:px-4 lg:px-6 mx-auto flex flex-col items-start space-y-5 sm:space-y-6 md:space-y-7 pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8">
          <p className="text-sm tracking-[0.6em] text-gold" data-aos="fade-up">
            TAJI LUXURY EVENTS AND ACADEMY
          </p>
          <h1
            className="max-w-5xl font-playfair font-semibold leading-[1.08] text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            We train aspiring event professionals
            <span className="block">and create unforgettable luxury event experiences.</span>
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-mist/90" data-aos="fade-up" data-aos-delay="300">
            Weddings, milestone celebrations, brand launches, and immersive academy programs designed for creative professionals.
          </p>
          <div className="flex flex-wrap gap-4 mt-3 sm:mt-4 md:mt-5" data-aos="fade-up" data-aos-delay="450">
            <a
              href="/academy"
              className="px-6 py-3 rounded-full bg-primary text-sm tracking-wide uppercase text-gold hover:bg-primary hover:text-ivory transition"
            >
              Join Taji Academy
            </a>
            <a
              href="/events"
              className="px-6 py-3 rounded-full bg-primary text-sm tracking-wide uppercase text-ivory hover:bg-gold hover:text-charcoal transition"
            >
              Decor Services
            </a>
            <a
              href="/events"
              className="px-6 py-3 rounded-full bg-primary text-sm tracking-wide uppercase text-ivory hover:bg-gold hover:text-charcoal transition"
            >
              Plan an Event
            </a>
          </div>
        </div>
      </div>

      {mediaSlides.length ? (
        <div className="relative z-10 w-full px-3 sm:px-4 lg:px-6 mt-10 pb-10 sm:pb-14" data-aos="fade-up" data-aos-delay="600">
          <div className="mx-auto max-w-6xl rounded-3xl border border-white/20 bg-black/30 backdrop-blur p-3 sm:p-4">
            <p className="text-xs uppercase tracking-[0.5em] text-gold/80 mb-3">Inside the atelier</p>
            <div className="flex gap-3 overflow-x-auto pb-1 filmstrip">
              {mediaSlides.map((media, index) => (
                <figure
                  key={`${media.src}-${index}`}
                  className="relative flex-shrink-0 w-32 h-20 rounded-2xl overflow-hidden border border-white/10"
                >
                  <ResponsiveImage
                    src={media.src}
                    alt={media.alt}
                    className="h-full w-full object-cover"
                    sizes="128px"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></span>
                </figure>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
