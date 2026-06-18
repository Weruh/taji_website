import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import coursesData from '../data/courses.json'
import { academyAdditionalFees } from '../data/content.js'
import { normalizeMediaList } from '../utils/media.js'
import { formatKES } from '../utils/format.js'
import { API_BASE_URL, PAYSTACK_PUBLIC_KEY } from '../config/payments.js'

const courses = normalizeMediaList(coursesData, ['image'])

export default function Checkout() {
  const { courseSlug } = useParams()
  const course = useMemo(() => courses.find((item) => item.slug === courseSlug), [courseSlug])

  const [selectedOption, setSelectedOption] = useState('full')
  const [errors, setErrors] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
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

  const separateFeesKES = academyAdditionalFees.reduce((total, fee) => total + Number(fee.amount || 0), 0)
  const separateFeesUSD = academyAdditionalFees.reduce((total, fee) => total + Number(fee.usd || 0), 0)
  const isEstimatedCourseFeeUSD = !course.course_fee_usd
  const schoolFeeUSD = course.course_fee_usd || Math.round(Number(course.course_fee || 0) / 125)
  const subtotalKES = Number(course.course_fee || 0) + separateFeesKES
  const subtotalUSD = schoolFeeUSD + separateFeesUSD
  const amountKES = selectedOption === 'half' ? Math.ceil(subtotalKES / 2) : subtotalKES

  const handlePaystackPayment = async () => {
    if (!PAYSTACK_PUBLIC_KEY) {
      setErrors(['Paystack public key is missing'])
      return
    }

    const email = document.getElementById('email').value.trim()
    const name = document.getElementById('name').value.trim()

    if (!name || !email) {
      setErrors(['Please fill in your name and email before paying.'])
      return
    }

    setErrors([])
    setStatusMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/paystack/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountKES,
          email,
          name,
          courseTitle: course.title,
        }),
      })

      const bodyText = await response.text()
      let data = {}

      try {
        data = bodyText ? JSON.parse(bodyText) : {}
      } catch {
        data = { message: bodyText }
      }

      if (!response.ok) {
        setErrors([data.message || `Payment gateway unavailable. API returned ${response.status}.`])
        setIsSubmitting(false)
        return
      }

      if (!data.status) {
        setErrors([data.message || 'Failed to initialize payment'])
        setIsSubmitting(false)
        return
      }

      if (!window.PaystackPop) {
        setErrors(['Paystack checkout script is not loaded. Please refresh and try again.'])
        setIsSubmitting(false)
        return
      }

      const callbacks = {
        onSuccess: (transaction) => {
          window.location.href = `/success?reference=${transaction.reference || data.reference}`
        },

        onCancel: () => {
          setStatusMessage('Payment was cancelled')
          setIsSubmitting(false)
        },

        onError: (error) => {
          console.error(error)
          setErrors(['Payment error occurred. Please try again.'])
          setIsSubmitting(false)
        },
      }

      if (typeof window.PaystackPop === 'function') {
        const popup = new window.PaystackPop()

        if (typeof popup.resumeTransaction === 'function' && data.access_code) {
          popup.resumeTransaction(data.access_code, callbacks)
          return
        }

        if (typeof popup.newTransaction === 'function') {
          popup.newTransaction({
            key: PAYSTACK_PUBLIC_KEY,
            email,
            amount: amountKES * 100,
            currency: 'KES',
            reference: data.reference,
            channels: ['mobile_money', 'card'],
            metadata: {
              customer_name: name,
              course: course.title,
            },
            ...callbacks,
          })
          return
        }
      }

      if (typeof window.PaystackPop.setup === 'function') {
        const handler = window.PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email,
          amount: amountKES * 100,
          currency: 'KES',
          ref: data.reference,
          access_code: data.access_code,
          channels: ['mobile_money', 'card'],
          callback: callbacks.onSuccess,
          onClose: callbacks.onCancel,
        })
        handler.openIframe()
        return
      }

      setErrors(['This browser could not start Paystack checkout. Please refresh and try again.'])
      setIsSubmitting(false)

    } catch (error) {
      console.error(error)
      setErrors([`Unable to connect to payment gateway at ${API_BASE_URL}. Please try again shortly or contact Taji directly.`])
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

            {errors.length > 0 && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
                {errors.map((err, i) => <p key={i}>{err}</p>)}
              </div>
            )}

            {statusMessage && (
              <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                <p>{statusMessage}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="rounded-2xl border border-gold/20 bg-gold/10 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-gold/80">Payment Breakdown</p>
                <p className="mt-2 text-xs leading-relaxed text-mist/70">
                  The fees below are not included in the school fees. They are paid separately and included in this checkout
                  subtotal.
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="text-mist">School fee</span>
                    <span className="text-right font-semibold text-ivory">
                      KES {formatKES(course.course_fee)}
                      <span className="text-mist/60">
                        {' '}
                        / {isEstimatedCourseFeeUSD ? 'approx. ' : ''}${schoolFeeUSD}
                      </span>
                    </span>
                  </div>

                  {academyAdditionalFees.map((fee, index) => (
                    <div key={fee.label} className="border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-semibold text-ivory">
                          {index + 1}. {fee.label} - ${fee.usd}
                        </span>
                        <span className="shrink-0 text-right text-gold">KES {formatKES(fee.amount)}</span>
                      </div>
                      {fee.note ? <p className="mt-1 text-xs leading-relaxed text-mist/70">{fee.note}</p> : null}
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-gold/20 bg-charcoal/60 p-3">
                  <div className="flex items-start justify-between gap-4 text-xs text-mist/70">
                    <span>Separate fees subtotal</span>
                    <span className="text-right text-ivory">
                      KES {formatKES(separateFeesKES)} <span className="text-mist/60">/ ${separateFeesUSD}</span>
                    </span>
                  </div>
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="text-xs uppercase tracking-[0.25em] text-gold/70">Subtotal to Pay</p>
                    <p className="mt-1 text-xl font-playfair text-gold">
                      KES {formatKES(subtotalKES)}{' '}
                      <span className="text-sm text-mist/70">
                        / {isEstimatedCourseFeeUSD ? 'approx. ' : ''}${subtotalUSD}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs uppercase tracking-[0.4em] text-gold/70">Payment option</div>
              
              <fieldset className="space-y-2">
                <label className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-ivory hover:border-gold cursor-pointer">
                  <div>
                    <div className="font-semibold">Pay in full</div>
                    <div className="text-xs text-mist/70">School fee plus separate fees: KES {formatKES(subtotalKES)}</div>
                  </div>
                  <input
                    type="radio"
                    checked={selectedOption === 'full'}
                    onChange={() => setSelectedOption('full')}
                    className="h-4 w-4 accent-gold"
                  />
                </label>

                <label className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-ivory hover:border-gold cursor-pointer">
                  <div>
                    <div className="font-semibold">Two installments</div>
                    <div className="text-xs text-mist/70">First installment: KES {formatKES(Math.ceil(subtotalKES / 2))}</div>
                  </div>
                  <input
                    type="radio"
                    checked={selectedOption === 'half'}
                    onChange={() => setSelectedOption('half')}
                    className="h-4 w-4 accent-gold"
                  />
                </label>
              </fieldset>
              <p className="text-xs text-mist/60">
                For two installments, the first payment is due before classes begin and the second during the class period.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm text-ivory/80">
                  <span className="block mb-1">Full name</span>
                  <input id="name" type="text" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm focus:border-gold focus:outline-none" required />
                </label>
                <label className="block text-sm text-ivory/80">
                  <span className="block mb-1">Email</span>
                  <input id="email" type="email" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm focus:border-gold focus:outline-none" required />
                </label>
              </div>

              <button
                type="button"
                onClick={handlePaystackPayment}
                disabled={isSubmitting}
                className="w-full rounded-full border border-gold bg-gold/10 px-5 py-3 text-sm uppercase tracking-[0.4em] text-gold transition hover:bg-gold hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Processing...' : `Pay Now - KES ${formatKES(amountKES)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
