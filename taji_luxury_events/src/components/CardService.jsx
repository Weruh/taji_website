import { normalizePath } from '../utils/media.js'

export default function CardService({ service }) {
  return (
    <article className="rounded-3xl overflow-hidden border border-white/10 bg-charcoal/40 hover:-translate-y-1 hover:border-gold/40 transition group" data-aos="fade-up">
      <div className="h-48 overflow-hidden">
        <img
          src={normalizePath(service.image)}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          role="img"
          aria-label={`${service.title} visual`}
        />
      </div>
      <div className="p-6 space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-gold/80">Service</p>
        <h3 className="text-2xl font-playfair text-ivory">{service.title}</h3>
        <p className="text-sm text-mist">{service.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {service.highlights?.map((highlight, index) => (
            <span key={`${service.slug}-${index}`} className="px-3 py-1 rounded-full border border-white/10">
              {highlight}
            </span>
          ))}
        </div>
        {service.cta && service.link ? (
          <a
            href={service.link}
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.4em] text-gold hover:border-gold hover:text-gold transition"
          >
            {service.cta}
          </a>
        ) : null}
      </div>
    </article>
  )
}
