import { useRef, useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import faqsData from '../data/faqs.json'

export default function Contact() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [openIndex, setOpenIndex] = useState(null)
  const formRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()

    if (!name || !email || !message) {
      setError('Please fill in your name, email, and message before sending.')
      return
    }

    const lines = [
      'New Inquiry -- Taji Luxury Events and Academy',
      '---',
      name ? `Name: ${name}` : null,
      email ? `Email: ${email}` : null,
      data.get('phone') ? `Phone: ${data.get('phone')}` : null,
      data.get('interest') ? `Interest: ${data.get('interest')}` : null,
      data.get('event_date') ? `Event Date: ${data.get('event_date')}` : null,
      data.get('guests') ? `Guests: ${data.get('guests')}` : null,
      data.get('venue') ? `Venue: ${data.get('venue')}` : null,
      data.get('setting') ? `Indoor/Outdoor: ${data.get('setting')}` : null,
      data.get('theme') ? `Theme: ${data.get('theme')}` : null,
      data.get('colours') ? `Colours: ${data.get('colours')}` : null,
      '---',
      message ? `Message: ${message}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const url = `https://wa.me/254742574329?text=${encodeURIComponent(lines)}`
    window.open(url, '_blank', 'noopener')
    form.reset()
    setSuccess(true)
  }

  const handleReset = () => {
    setSuccess(false)
    setError('')
    formRef.current?.reset()
  }

  return (
    <section className="px-3 sm:px-4 lg:px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-8" data-aos="fade-up">
        <Breadcrumbs crumbs={[{ label: 'Home', url: '/' }, { label: 'Contact' }]} />
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="uppercase text-xs tracking-[0.5em] text-gold">Contact</p>
              <h1 className="text-4xl font-playfair">Start a conversation</h1>
              <p className="text-sm text-mist mt-3">
                Fill in the details below. On submission your message opens directly in WhatsApp so our concierge team receives it
                instantly.
              </p>
            </div>

            {success ? (
              <div className="rounded-3xl border border-gold/40 bg-gold/10 p-8 text-center space-y-4">
                <p className="text-xl font-playfair text-ivory">Opening WhatsApp...</p>
                <p className="text-sm text-mist">
                  Your details are pre-filled in WhatsApp. Just hit send and our team will respond within the hour.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 px-6 py-2 rounded-full border border-gold/40 text-gold text-xs uppercase tracking-wide hover:bg-gold/10 transition"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] text-mist/70">Name *</span>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-1 w-full rounded-2xl px-4 py-3 bg-white/5 border border-white/10 focus:border-gold focus:outline-none"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] text-mist/70">Email *</span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 w-full rounded-2xl px-4 py-3 bg-white/5 border border-white/10 focus:border-gold focus:outline-none"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] text-mist/70">Phone / WhatsApp</span>
                  <input
                    type="tel"
                    name="phone"
                    className="mt-1 w-full rounded-2xl px-4 py-3 bg-white/5 border border-white/10 focus:border-gold focus:outline-none"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] text-mist/70">I am interested in</span>
                  <select
                    name="interest"
                    className="mt-1 w-full rounded-2xl px-4 py-3 bg-charcoal border border-white/10 focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Select --</option>
                    <option>Wedding Planning</option>
                    <option>Wedding Decor and Styling</option>
                    <option>Corporate Event</option>
                    <option>Product Launch</option>
                    <option>Gala Dinner</option>
                    <option>Floral Design</option>
                    <option>Balloon Design</option>
                    <option>Academy Enrollment</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] text-mist/70">Date of Event</span>
                  <input
                    type="date"
                    name="event_date"
                    className="mt-1 w-full rounded-2xl px-4 py-3 bg-white/5 border border-white/10 focus:border-gold focus:outline-none"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block text-sm">
                    <span className="text-xs uppercase tracking-[0.3em] text-mist/70">Guests Expected</span>
                    <input
                      type="number"
                      name="guests"
                      min="1"
                      className="mt-1 w-full rounded-2xl px-4 py-3 bg-white/5 border border-white/10 focus:border-gold focus:outline-none"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-xs uppercase tracking-[0.3em] text-mist/70">Indoor / Outdoor</span>
                    <input
                      type="text"
                      name="setting"
                      placeholder="e.g. Indoor"
                      className="mt-1 w-full rounded-2xl px-4 py-3 bg-white/5 border border-white/10 focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] text-mist/70">Venue Location</span>
                  <input
                    type="text"
                    name="venue"
                    className="mt-1 w-full rounded-2xl px-4 py-3 bg-white/5 border border-white/10 focus:border-gold focus:outline-none"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block text-sm">
                    <span className="text-xs uppercase tracking-[0.3em] text-mist/70">Theme</span>
                    <input
                      type="text"
                      name="theme"
                      className="mt-1 w-full rounded-2xl px-4 py-3 bg-white/5 border border-white/10 focus:border-gold focus:outline-none"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-xs uppercase tracking-[0.3em] text-mist/70">Colours</span>
                    <input
                      type="text"
                      name="colours"
                      className="mt-1 w-full rounded-2xl px-4 py-3 bg-white/5 border border-white/10 focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] text-mist/70">Message *</span>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    className="mt-1 w-full rounded-2xl px-4 py-3 bg-white/5 border border-white/10 focus:border-gold focus:outline-none resize-none"
                  ></textarea>
                </label>

                {error ? (
                  <p className="text-sm text-red-400 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3">{error}</p>
                ) : null}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-[#25D366] text-white text-sm uppercase tracking-wide hover:bg-[#20bc5a] transition font-semibold"
                >
                  <img src="/img/whatsapp.svg" alt="" className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  Send via WhatsApp
                </button>
                <p className="text-xs text-center text-mist/60">
                  Tapping the button opens WhatsApp with your details pre-filled. Just hit send.
                </p>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.792230609783!2d36.781061099999995!3d-1.2994603999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1b1146384663%3A0xd90e0e9abcb51977!2sApplewood%20Adams!5e0!3m2!1sen!2ske!4v1763002504494!5m2!1sen!2ske"
                className="w-full h-[420px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Taji Luxury Events headquarters map"
              ></iframe>
            </div>
            <div className="rounded-3xl border border-white/10 p-6 space-y-3">
              <p className="text-sm uppercase tracking-[0.4em] text-gold/80">Concierge Desk</p>
              <p className="text-ivory">tajiluxuryevents@gmail.com</p>
              <a
                href="https://wa.me/254742574329?text=Hello%20Taji%20team"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-ivory hover:text-gold transition"
              >
                <img src="/img/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 flex-shrink-0" />
                +254 742 574 329
              </a>
              <p className="text-sm text-mist">Apple Wood Adams, Kilimani, Ngong Road, Nairobi</p>
              <p className="text-xs text-mist/60 mt-2">WhatsApp response within 15 minutes during business hours.</p>
            </div>
            <div className="rounded-3xl border border-white/10 p-6">
              <p className="text-sm uppercase tracking-[0.4em] text-gold/80">FAQ</p>
              <div className="mt-4 space-y-3">
                {faqsData.map((faq, index) => (
                  <div key={faq.q} className="border border-white/10 rounded-2xl">
                    <button
                      type="button"
                      className="w-full text-left px-4 py-3 flex items-center justify-between"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                      <span>{faq.q}</span>
                      <span>{openIndex === index ? '-' : '+'}</span>
                    </button>
                    {openIndex === index ? <div className="px-4 pb-3 text-sm text-mist">{faq.a}</div> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
