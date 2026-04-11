import { useRef } from 'react'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { corporateCaseStudy, corporateRoiPoints } from '../data/content.js'
import { eventMedia } from '../data/media.js'
import { usePlanningModal } from '../hooks/usePlanningModal.js'

export default function Corporate() {
  const formRef = useRef(null)
  const { open } = usePlanningModal()
  const eventImages = eventMedia.filter((src) => !src.endsWith('.svg'))

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = formRef.current
    if (!form) return
    const data = new FormData(form)
    const message = [
      'Corporate Experiences',
      `Name: ${data.get('name') || ''}`,
      `Phone: ${data.get('phone') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Company: ${data.get('company') || ''}`,
      `Date of Event: ${data.get('event_date') || ''}`,
      `Guests Expected: ${data.get('guests') || ''}`,
      `Venue Location: ${data.get('venue') || ''}`,
      `Indoor/Outdoor: ${data.get('setting') || ''}`,
      `Theme: ${data.get('theme') || ''}`,
      `Colours: ${data.get('colours') || ''}`,
      `Objectives/Notes: ${data.get('message') || ''}`,
    ]
      .filter(Boolean)
      .join('\n')
    const url = `https://wa.me/254742574329?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener')
  }

  return (
    <>
      <section className="px-3 sm:px-4 lg:px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-6" data-aos="fade-up">
          <Breadcrumbs crumbs={[{ label: 'Home', url: '/' }, { label: 'Events', url: '/events' }, { label: 'Corporate' }]} />
          <h1 className="text-4xl font-playfair">Corporate Experiences</h1>
          <p className="text-lg text-mist">
            Strategy-led corporate launches, summits, and brand immersions with measurable ROI. We architect guest journeys,
            ensure executive-ready delivery, and stage immersive storytelling.
          </p>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 pb-12" data-aos="fade-up">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-white/10 p-6 bg-white/5">
            <p className="text-sm uppercase tracking-[0.4em] text-gold/80">Share your brief</p>
            <h2 className="text-2xl font-playfair mt-2 text-ivory">Send details to WhatsApp</h2>
            <p className="text-sm text-mist/80 mt-1">We reply with timelines, budgets, and a tailored production plan.</p>
            <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm text-ivory/80">
                  <span className="block mb-1">Name</span>
                  <input type="text" name="name" className="w-full rounded-xl bg-charcoal border border-white/10 px-3 py-2 text-sm" required />
                </label>
                <label className="block text-sm text-ivory/80">
                  <span className="block mb-1">Phone</span>
                  <input type="tel" name="phone" className="w-full rounded-xl bg-charcoal border border-white/10 px-3 py-2 text-sm" required />
                </label>
              </div>
              <label className="block text-sm text-ivory/80">
                <span className="block mb-1">Email</span>
                <input type="email" name="email" className="w-full rounded-xl bg-charcoal border border-white/10 px-3 py-2 text-sm" />
              </label>
              <label className="block text-sm text-ivory/80">
                <span className="block mb-1">Company / Brand</span>
                <input type="text" name="company" className="w-full rounded-xl bg-charcoal border border-white/10 px-3 py-2 text-sm" />
              </label>
              <label className="block text-sm text-ivory/80">
                <span className="block mb-1">Date of Event</span>
                <input type="date" name="event_date" className="w-full rounded-xl bg-charcoal border border-white/10 px-3 py-2 text-sm" />
              </label>
              <label className="block text-sm text-ivory/80">
                <span className="block mb-1">Number of Guests Expected</span>
                <input type="number" name="guests" min="1" className="w-full rounded-xl bg-charcoal border border-white/10 px-3 py-2 text-sm" />
              </label>
              <label className="block text-sm text-ivory/80">
                <span className="block mb-1">Venue Location</span>
                <input type="text" name="venue" className="w-full rounded-xl bg-charcoal border border-white/10 px-3 py-2 text-sm" />
              </label>
              <label className="block text-sm text-ivory/80">
                <span className="block mb-1">Indoor / Outdoor Venue</span>
                <input type="text" name="setting" className="w-full rounded-xl bg-charcoal border border-white/10 px-3 py-2 text-sm" placeholder="Indoor, outdoor, or hybrid" />
              </label>
              <label className="block text-sm text-ivory/80">
                <span className="block mb-1">Theme</span>
                <input type="text" name="theme" className="w-full rounded-xl bg-charcoal border border-white/10 px-3 py-2 text-sm" />
              </label>
              <label className="block text-sm text-ivory/80">
                <span className="block mb-1">Colours</span>
                <input type="text" name="colours" className="w-full rounded-xl bg-charcoal border border-white/10 px-3 py-2 text-sm" />
              </label>
              <label className="block text-sm text-ivory/80">
                <span className="block mb-1">Objectives / Notes</span>
                <textarea name="message" rows="3" className="w-full rounded-xl bg-charcoal border border-white/10 px-3 py-2 text-sm"></textarea>
              </label>
              <button
                type="submit"
                className="w-full inline-flex justify-center px-6 py-3 rounded-full bg-primary text-ivory text-sm uppercase tracking-wide hover:bg-primary/90 transition"
              >
                Send to WhatsApp
              </button>
              <p className="text-xs text-mist/70">Submitting opens WhatsApp with your details prefilled.</p>
            </form>
          </div>
          <div className="rounded-3xl border border-white/10 p-6 bg-white/5 space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-gold/80">Reach Us</p>
            <div className="space-y-2 text-sm text-ivory">
              <p>
                <span className="text-mist/70">Phone / WhatsApp:</span>{' '}
                <a className="text-gold hover:text-goldBright" href="https://wa.me/254742574329" target="_blank" rel="noreferrer">
                  +254 742 574 329
                </a>
              </p>
              <p>
                <span className="text-mist/70">Email:</span>{' '}
                <a className="text-gold hover:text-goldBright" href="mailto:hello@tajiluxury.com">
                  hello@tajiluxury.com
                </a>
              </p>
              <p>
                <span className="text-mist/70">Office:</span> Nairobi
              </p>
            </div>
            <a
              href="https://wa.me/254742574329"
              target="_blank"
              rel="noreferrer"
              className="inline-flex justify-center px-6 py-3 rounded-full border border-gold text-sm uppercase tracking-wide text-gold hover:bg-gold hover:text-charcoal transition"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 pb-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventImages.map((media, index) => (
              <figure key={`${media}-${index}`} className="rounded-3xl overflow-hidden border border-white/10">
                <img src={media} alt={`Corporate showcase ${index + 1}`} className="w-full h-56 object-cover" loading="lazy" />
              </figure>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 p-6 grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.4em] text-gold/80">Corporate Services</p>
              <ul className="space-y-2 text-sm text-mist">
                {corporateRoiPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="text-gold">&diams;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gold/30 p-6 bg-gold/5">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/80">Quick Connect</p>
              <p className="text-lg font-semibold text-ivory mt-2">Talk to the Front Desk</p>
              <p className="text-sm text-mist/80 mt-1">Share your event details and we will reply on WhatsApp.</p>
              <button
                type="button"
                onClick={open}
                className="mt-4 inline-flex justify-center w-full px-6 py-3 rounded-full bg-primary text-ivory text-sm uppercase tracking-wide hover:bg-primary/90 transition"
              >
                Open WhatsApp Form
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-gold/30 p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/80">Case Study</p>
            <h3 className="text-2xl font-playfair mt-2">{corporateCaseStudy.client}</h3>
            <dl className="mt-4 space-y-2 text-sm text-mist">
              <div>
                <dt className="font-semibold text-ivory">Challenge</dt>
                <dd>{corporateCaseStudy.challenge}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ivory">Solution</dt>
                <dd>{corporateCaseStudy.solution}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ivory">Result</dt>
                <dd>{corporateCaseStudy.result}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
