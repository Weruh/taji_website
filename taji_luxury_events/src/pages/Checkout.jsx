import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import coursesData from '../data/courses.json'
import { normalizeMediaList } from '../utils/media.js'
import { formatKES } from '../utils/format.js'

const courses = normalizeMediaList(coursesData, ['image'])

export default function Checkout() {
  const { courseSlug } = useParams()
  const course = useMemo(() => courses.find((item) => item.slug === courseSlug), [courseSlug])
  const [selectedOption, setSelectedOption] = useState('full')
  const [errors, setErrors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!course) {
    return (
      <section className="px-3 sm:px-4 lg:px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-6" data-aos="fade-up">
          <h1 className="text-4xl font-playfair">Page not found</h1>
          <p className="text-sm text-mist">The resource you are after may have moved.</p>
        </div>
      </section>
    )
  }

  const halfAmount = Math.ceil((course.total_fee || 0) / 2)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrors([])
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    if (!name || !email) {
      setErrors(['Please provide both your name and email so we can send the payment link.'])
      return
    }
    setIsSubmitting(true)
    try {
      const apiBase = import.meta.env.VITE_API_BASE || ''
      const response = await fetch(`${apiBase}/api/paystack/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          courseSlug: course.slug,
          paymentOption: selectedOption,
        }),
      })

      const payload = await response.json()
      if (!response.ok || !payload.authorization_url) {
        const message = payload?.error || payload?.message || 'Payment setup failed. Please try again.'
        setErrors([message])
        return
      }

      window.location.assign(payload.authorization_url)
    } catch (error) {
      setErrors(['Unable to reach the payment server. Please try again shortly.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="px-3 sm:px-4 lg:px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-10" data-aos="fade-up">
        <Breadcrumbs
          crumbs={[
            { label: 'Home', url: '/' },
            { label: 'Academy', url: '/academy' },
            { label: 'Checkout' },
          ]}
        />
        <div className="space-y-2">
          <p className="uppercase text-xs tracking-[0.5em] text-gold">Academy</p>
          <h1 className="text-4xl font-playfair">{course.title}</h1>
          <p className="text-lg text-mist">{course.summary}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/80">Course highlights</p>
            <p className="text-sm text-ivory/80">{course.summary}</p>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-gold/70">What you will learn</p>
              <ul className="space-y-2 pl-4 text-sm text-ivory/80 marker:text-gold">
                {course.outcomes?.map((outcome, index) => (
                  <li key={`${course.slug}-outcome-${index}`}>{outcome}</li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">Level</p>
                <p className="text-sm text-ivory">{course.level}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">Duration</p>
                <p className="text-sm text-ivory">{course.duration}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-charcoal/60 p-8 space-y-6">
            <h2 className="text-2xl font-playfair text-ivory">Secure your seat</h2>
            {errors.length ? (
              <div className="space-y-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-xs uppercase tracking-[0.4em] text-gold/70">Payment option</div>
              <fieldset className="space-y-2">
                <label className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-ivory hover:border-gold cursor-pointer">
                  <div>
                    <div className="font-semibold">Pay in full</div>
                    <div className="text-xs text-mist/70">KES {formatKES(course.total_fee)}</div>
                  </div>
                  <input
                    type="radio"
                    name="payment_option"
                    value="full"
                    className="h-4 w-4 accent-gold"
                    checked={selectedOption === 'full'}
                    onChange={() => setSelectedOption('full')}
                  />
                </label>
                <label className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-ivory hover:border-gold cursor-pointer">
                  <div>
                    <div className="font-semibold">50% deposit</div>
                    <div className="text-xs text-mist/70">KES {formatKES(halfAmount)}</div>
                  </div>
                  <input
                    type="radio"
                    name="payment_option"
                    value="half"
                    className="h-4 w-4 accent-gold"
                    checked={selectedOption === 'half'}
                    onChange={() => setSelectedOption('half')}
                  />
                </label>
              </fieldset>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm text-ivory/80">
                  <span className="block mb-1">Full name</span>
                  <input type="text" name="name" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm focus:border-gold focus:outline-none" required />
                </label>
                <label className="block text-sm text-ivory/80">
                  <span className="block mb-1">Email</span>
                  <input type="email" name="email" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm focus:border-gold focus:outline-none" required />
                </label>
              </div>
              <label className="block text-sm text-ivory/80">
                <span className="block mb-1">Phone number</span>
                <input type="tel" name="phone" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm focus:border-gold focus:outline-none" />
              </label>

              <button
                type="submit"
                className="w-full rounded-full border border-gold bg-gold/10 px-5 py-3 text-sm uppercase tracking-[0.4em] text-gold transition hover:bg-gold hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connecting to Paystack...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
