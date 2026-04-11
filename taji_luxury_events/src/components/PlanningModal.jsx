import { useEffect, useRef } from 'react'
import { usePlanningModal } from '../hooks/usePlanningModal.js'

export default function PlanningModal() {
  const { isOpen, close } = usePlanningModal()
  const formRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (event) => {
      if (event.key === 'Escape') close()
    }
    document.body.classList.add('overflow-hidden')
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.classList.remove('overflow-hidden')
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, close])

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = formRef.current
    if (!form) return
    const data = new FormData(form)
    const message = [
      'Decor Services',
      `Name: ${data.get('name') || ''}`,
      `Phone: ${data.get('phone') || ''}`,
      `Date of Event: ${data.get('event_date') || ''}`,
      `Guests Expected: ${data.get('guests') || ''}`,
      `Venue Location: ${data.get('venue') || ''}`,
      `Indoor/Outdoor: ${data.get('setting') || ''}`,
      `Theme: ${data.get('theme') || ''}`,
      `Colours: ${data.get('colours') || ''}`,
    ]
      .filter(Boolean)
      .join('\n')
    const url = `https://wa.me/254742574329?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener')
    close()
    form.reset()
  }

  return (
    <div
      id="planning-modal"
      className={`fixed inset-0 z-50 items-center justify-center px-4 ${isOpen ? 'flex' : 'hidden'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="planning-modal-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur" onClick={close} aria-hidden="true"></div>
      <div className="relative max-w-xl w-full rounded-3xl border border-white/10 bg-charcoal p-8 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-gold">Decor Services</p>
            <h2 id="planning-modal-title" className="text-2xl font-playfair mt-2 text-ivory">
              Start Planning
            </h2>
            <p className="text-sm text-mist/80 mt-1">
              Share the details and we will respond via WhatsApp with next steps.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/10 text-ivory hover:bg-white/5"
            aria-label="Close planning form"
          >
            &times;
          </button>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-ivory/80">
              <span className="block mb-1">Name</span>
              <input type="text" name="name" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm" required />
            </label>
            <label className="block text-sm text-ivory/80">
              <span className="block mb-1">Phone Number</span>
              <input type="tel" name="phone" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm" required />
            </label>
          </div>
          <label className="block text-sm text-ivory/80">
            <span className="block mb-1">Date of Event</span>
            <input type="date" name="event_date" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm" required />
          </label>
          <label className="block text-sm text-ivory/80">
            <span className="block mb-1">Number of Guests Expected</span>
            <input type="number" name="guests" min="1" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm" required />
          </label>
          <label className="block text-sm text-ivory/80">
            <span className="block mb-1">Venue Location</span>
            <input type="text" name="venue" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm" required />
          </label>
          <label className="block text-sm text-ivory/80">
            <span className="block mb-1">Indoor / Outdoor Venue</span>
            <input type="text" name="setting" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm" placeholder="Indoor, outdoor, or hybrid" required />
          </label>
          <label className="block text-sm text-ivory/80">
            <span className="block mb-1">Theme</span>
            <input type="text" name="theme" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm" required />
          </label>
          <label className="block text-sm text-ivory/80">
            <span className="block mb-1">Colours</span>
            <input type="text" name="colours" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm" required />
          </label>
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="inline-flex justify-center px-6 py-3 rounded-full bg-primary text-ivory text-sm uppercase tracking-wide hover:bg-primary/90 transition"
            >
              Send via WhatsApp
            </button>
            <p className="text-xs text-mist/70">Submitting opens WhatsApp with these details and your contact info.</p>
          </div>
        </form>
      </div>
    </div>
  )
}
