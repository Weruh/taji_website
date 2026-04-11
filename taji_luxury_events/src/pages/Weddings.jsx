import Breadcrumbs from '../components/Breadcrumbs.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { weddingMedia } from '../data/media.js'
import { bridalSupport } from '../data/content.js'

export default function Weddings() {
  return (
    <>
      <section className="px-3 sm:px-4 lg:px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-6" data-aos="fade-up">
          <Breadcrumbs crumbs={[{ label: 'Home', url: '/' }, { label: 'Events', url: '/events' }, { label: 'Weddings' }]} />
          <p className="uppercase text-xs tracking-[0.5em] text-gold">Weddings</p>
          <h1 className="text-4xl md:text-5xl font-playfair text-ivory">Weddings and Luxury Celebrations</h1>
          <p className="text-lg text-mist">
            Romantic, modern, or boldly editorial, our weddings feel warm, personal, and easy. We walk closely with brides and
            couples, offering guidance, planning support, styling, and a calm presence.
          </p>
          <div className="mt-6">
            <a
              href="https://wa.me/254742574329?text=Hi%20Taji%2C%20I%27d%20like%20to%20plan%20a%20luxury%20wedding%20experience."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-3 text-xs uppercase tracking-[0.4em] text-gold hover:bg-gold hover:text-charcoal transition"
            >
              Send us a WhatsApp note
            </a>
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 pb-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {weddingMedia.map((media, index) => (
              <figure key={`${media}-${index}`} className="h-56 rounded-2xl overflow-hidden">
                <img src={media} alt={`Weddings showcase ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </figure>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 p-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-gold/80">Aesthetic Direction</p>
              <p className="mt-4 text-lg text-mist">
                Palette development, tablescape artistry, floral couture, and lighting that reveals every detail with softness.
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-gold/80">Bridal Care</p>
              <ul className="mt-4 space-y-2 text-sm">
                {bridalSupport.map((item) => (
                  <li key={item} className="flex items-start space-x-2">
                    <span className="text-gold">&hearts;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
