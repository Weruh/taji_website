import { normalizePath } from '../utils/media.js'

export default function TestimonialCard({ testimonial }) {
  return (
    <figure className="p-8 rounded-3xl border border-white/10 bg-white/5 h-full flex flex-col gap-4">
      <div className="flex items-center space-x-3">
        <img
          src={normalizePath(testimonial.avatar)}
          alt={`${testimonial.name} avatar`}
          className="h-12 w-12 rounded-full object-cover border border-white/10"
          loading="lazy"
        />
        <div>
          <figcaption className="text-base font-semibold text-ivory">{testimonial.name}</figcaption>
          <p className="text-xs uppercase tracking-wide text-mist/70">{testimonial.role}</p>
        </div>
      </div>
      <blockquote className="text-lg font-playfair text-mist/90 flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
    </figure>
  )
}
