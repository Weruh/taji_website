import { useEffect, useRef } from 'react'

export default function SectionFoundation() {
  const particlesRef = useRef(null)

  useEffect(() => {
    const target = particlesRef.current
    if (!target || target.childElementCount) return
    const total = 40
    for (let i = 0; i < total; i += 1) {
      const dot = document.createElement('span')
      dot.className = 'particle'
      dot.style.left = `${Math.random() * 100}%`
      dot.style.top = `${Math.random() * 100}%`
      dot.style.animationDelay = `${Math.random() * 12}s`
      dot.style.animationDuration = `${16 + Math.random() * 12}s`
      target.appendChild(dot)
    }
  }, [])

  return (
    <section className="foundation-section relative overflow-hidden py-24" aria-labelledby="foundation-title">
      <div ref={particlesRef} className="foundation-particles" data-foundation-particles></div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-5 text-center space-y-6 relative z-10">
        <p className="text-sm uppercase tracking-[0.6em] text-gold">Our DNA</p>
        <h2 id="foundation-title" className="text-4xl md:text-5xl font-playfair text-gold">
          Our Foundation
        </h2>
        <p className="text-base md:text-lg text-ivory/80 max-w-3xl mx-auto">
          Strategy, ceremony, and education interwoven into a single, unmistakable Taji signature.
        </p>
      </div>

      <div className="foundation-visual max-w-5xl mx-auto mt-16 relative z-10">
        <img
          src="/img/academy/tajimainlogo.webp"
          alt="Taji foundation triangle artwork"
          className="w-full h-auto rounded-[32px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)] object-cover"
          loading="lazy"
        />
      </div>

      <div className="foundation-caption max-w-4xl mx-auto px-3 sm:px-4 lg:px-5 mt-10 text-center text-ivory/70 text-sm">
        Each branch feeds the others&mdash;corporate rigor, wedding soul, and academy mastery fuel the Taji ecosystem.
      </div>
    </section>
  )
}
