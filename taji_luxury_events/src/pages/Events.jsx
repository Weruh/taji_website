import Breadcrumbs from '../components/Breadcrumbs.jsx'
import CardService from '../components/CardService.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import servicesData from '../data/services.json'
import { eventMedia } from '../data/media.js'
import { normalizeMediaList } from '../utils/media.js'

const services = normalizeMediaList(servicesData, ['image'])

export default function Events() {
  const filtered = services.filter((service) => service.slug !== 'academy')
  const eventImages = eventMedia.filter((src) => !src.endsWith('.svg'))

  return (
    <>
      <section className="px-3 sm:px-4 lg:px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-6" data-aos="fade-up">
          <Breadcrumbs crumbs={[{ label: 'Home', url: '/' }, { label: 'Events' }]} />
          <p className="uppercase text-xs tracking-[0.5em] text-gold">Event Production</p>
          <h1 className="text-4xl md:text-5xl font-playfair text-ivory">Taji Luxury Events</h1>
          <p className="text-lg text-mist leading-relaxed">
            We craft experiences that speak luxury, emotion, and excellence. From weddings and milestone celebrations to corporate
            launches, we translate vision into reality with creativity, elegance, and seamless coordination.
          </p>
          <p className="text-sm text-mist leading-relaxed">
            Relax and enjoy -- our team handles every detail. Bridal care, decor, floral artistry, and production under one roof.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="/weddings" className="px-6 py-3 rounded-full bg-primary text-ivory text-sm uppercase tracking-wide hover:bg-primary/90 transition">
              Weddings
            </a>
            <a
              href="/corporate"
              className="px-6 py-3 rounded-full border border-gold text-gold text-sm uppercase tracking-wide hover:bg-gold hover:text-charcoal transition"
            >
              Corporate
            </a>
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 py-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <p className="uppercase text-xs tracking-[0.5em] text-gold">What We Do</p>
            <h2 className="text-3xl font-playfair text-ivory mt-2">Expertise</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {filtered.map((service) => (
              <CardService key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {eventImages.length ? (
        <section className="px-3 sm:px-4 lg:px-6 pb-16" data-aos="fade-up">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <p className="uppercase text-xs tracking-[0.5em] text-gold">Portfolio</p>
              <h2 className="text-3xl font-playfair text-ivory mt-2">Recent Productions</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {eventImages.slice(0, 12).map((media, index) => (
                <figure key={`${media}-${index}`} className="rounded-3xl overflow-hidden border border-white/10 group">
                  <img src={media} alt={`Taji Luxury Events showcase ${index + 1}`} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBanner />
    </>
  )
}
