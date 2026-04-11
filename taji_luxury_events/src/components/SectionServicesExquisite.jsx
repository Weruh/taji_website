import { useEffect, useMemo, useRef } from 'react'
import { normalizePath } from '../utils/media.js'

export default function SectionServicesExquisite({ services }) {
  const particlesRef = useRef(null)
  const serviceCards = useMemo(() => (services || []).slice(0, 3), [services])

  useEffect(() => {
    const container = particlesRef.current
    if (!container || container.childElementCount) return
    const count = 30
    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement('span')
      dot.className = 'particle'
      dot.style.left = `${Math.random() * 100}%`
      dot.style.top = `${Math.random() * 100}%`
      dot.style.animationDelay = `${Math.random() * 10}s`
      dot.style.animationDuration = `${14 + Math.random() * 10}s`
      container.appendChild(dot)
    }
  }, [])

  return (
    <section className="exquisite-section" aria-labelledby="exquisite-services-heading">
      <div ref={particlesRef} className="exquisite-particles" data-particles data-particles-count="30"></div>
      <div className="exquisite-container">
        <header className="exquisite-header" data-aos="fade-up">
          <div className="exquisite-header-ornament"></div>
          <p className="eyebrow">Services</p>
          <h1 id="exquisite-services-heading">Taji Luxury Events</h1>
          <p>Where elegance meets precision</p>
        </header>

        <div className="exquisite-services">
          <div className="text-center space-y-3 mb-12" data-aos="fade-up">
            <h2 className="section-title text-3xl md:text-4xl font-playfair tracking-[0.4em] text-gold uppercase">
              Our Services
            </h2>
            <p className="section-subtitle text-sm md:text-base text-ivory/70 italic">
              Curated experiences that transcend expectations
            </p>
          </div>
          <div className="exquisite-services-grid">
            {serviceCards.map((service, index) => (
              <article
                key={service.slug || service.title}
                className="exquisite-service-card flex h-full flex-col"
                data-aos="fade-up"
                data-aos-delay={index * 120}
              >
                <div className="service-image-container">
                  <img src={normalizePath(service.image)} alt={service.title} className="service-image" loading="lazy" />
                  <div className="service-image-overlay"></div>
                </div>
                <div className="service-content flex flex-1 flex-col gap-4">
                  <p className="service-label">Service</p>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.summary}</p>
                  <div className="service-features flex flex-wrap gap-2">
                    {service.highlights?.map((highlight, highlightIndex) => (
                      <span key={`${service.slug}-feature-${highlightIndex}`} className="feature-tag">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  {service.cta && service.link ? (
                    <a
                      href={service.link}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.4em] text-gold hover:border-gold hover:text-gold transition mt-4"
                    >
                      {service.cta}
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
