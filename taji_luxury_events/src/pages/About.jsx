import Breadcrumbs from '../components/Breadcrumbs.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { aboutTeam, aboutValues } from '../data/content.js'

export default function About() {
  return (
    <>
      <section className="px-3 sm:px-4 lg:px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-6" data-aos="fade-up">
          <Breadcrumbs crumbs={[{ label: 'Home', url: '/' }, { label: 'About' }]} />
          <p className="uppercase text-xs tracking-[0.5em] text-gold">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-playfair text-ivory">About Taji</h1>
          <p className="max-w-3xl text-lg text-mist leading-relaxed">
            We are a luxury events company and academy delivering exceptional events and industry-standard training. Our work is
            rooted in integrity, excellence, mastery, and professionalism, driven by intentional design and a commitment to
            remarkable outcomes.
          </p>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 pb-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <p className="uppercase text-xs tracking-[0.5em] text-gold">What Drives Us</p>
            <h2 className="text-3xl font-playfair text-ivory mt-2">Our Values</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {aboutValues.map((value, index) => (
              <div
                key={value.title}
                className="rounded-3xl border border-white/10 p-8 bg-white/5 hover:border-gold/30 transition-colors"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="w-10 h-0.5 bg-gold mb-6"></div>
                <h3 className="text-xl font-playfair text-ivory mb-3">{value.title}</h3>
                <p className="text-sm text-mist leading-relaxed">{value.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 py-16 bg-white/5" data-aos="fade-up">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-gold/20 bg-charcoal/60 shadow-2xl shadow-black/30">
            <img
              src="/img/about/awardimage.jpeg"
              alt="Taji Luxury Events and Academy Afri-Glo Choice Awards certificate and trophy"
              className="block w-full h-full object-cover"
              width="1080"
              height="1350"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="space-y-5">
            <p className="uppercase text-xs tracking-[0.5em] text-gold">Award Winning Academy</p>
            <h2 className="text-3xl md:text-4xl font-playfair text-ivory">Recognised for Excellence</h2>
            <p className="text-base md:text-lg text-mist leading-relaxed">
              Taji Luxury Events and Academy is an award-winning events company and training school, recently recognised at the
              Afri-Glo Choice Awards as the Event Planning and Management Academy of the Year. The June 13, 2026 award celebrates
              their impact, professionalism, and commitment to raising the standard of event planning education.
            </p>
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 py-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <p className="uppercase text-xs tracking-[0.5em] text-gold">The People</p>
            <h2 className="text-3xl font-playfair text-ivory mt-2">Leadership</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {aboutTeam.map((leader, index) => (
              <div
                key={leader.name}
                className="rounded-3xl border border-white/10 overflow-hidden bg-white/5 hover:border-gold/30 transition-colors"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {leader.image ? (
                  <div className="h-80 bg-white/5">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="block w-full h-full object-cover object-center transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <div className="h-80 bg-white/10"></div>
                )}
                <div className="p-6">
                  <p className="text-xl font-playfair text-ivory">{leader.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-gold mt-1">{leader.role}</p>
                  <p className="text-sm text-mist mt-3 leading-relaxed">{leader.blurb}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 p-8 flex flex-wrap items-center gap-6 bg-white/5">
            <p className="text-sm uppercase tracking-[0.4em] text-gold/80">Press and Recognition</p>
            <div className="flex flex-wrap gap-6 text-xs tracking-[0.4em] text-mist/70">
              <span>Vogue Wed</span>
              <span>Luxury Planners Guild</span>
              <span>Bloom Awards</span>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
