import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import coursesData from '../data/courses.json'
import { academyAdditionalFees } from '../data/content.js'
import { normalizeMediaList } from '../utils/media.js'
import { formatKES } from '../utils/format.js'
import { API_BASE_URL, PAYSTACK_PUBLIC_KEY } from '../config/payments.js'

const courses = normalizeMediaList(coursesData, ['image'])

export default function Checkout() {
  const { courseSlug } = useParams()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const course = useMemo(() => courses.find((item) => item.slug === courseSlug), [courseSlug])
  const paymentSectionRef = useRef(null)

  const [selectedOption, setSelectedOption] = useState('full')
  const [errors, setErrors] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (location.hash !== '#payment') return undefined

    const animationFrame = window.requestAnimationFrame(() => {
      paymentSectionRef.current?.scrollIntoView({ block: 'start' })
    })

    return () => window.cancelAnimationFrame(animationFrame)
  }, [courseSlug, location.hash])

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
  const registrationFee = academyAdditionalFees.find((fee) => fee.label === 'Registration Fee')
  const registrationFeeKES = Number(registrationFee?.amount || course.reg_fee || 2000)
  const isAcademyCoursePage = location.pathname.startsWith('/academy/courses/')
  const isRegistrationPayment = searchParams.get('payment') === 'registration'
  const subtotalKES = Number(course.course_fee || 0) + separateFeesKES
  const amountKES = isRegistrationPayment
    ? registrationFeeKES
    : selectedOption === 'half'
      ? Math.ceil(subtotalKES / 2)
      : subtotalKES

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
          courseTitle: isRegistrationPayment ? `${course.title} registration fee` : course.title,
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
              payment_type: isRegistrationPayment ? 'registration_fee' : selectedOption,
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
            { label: isAcademyCoursePage ? course.title : 'Checkout' },
          ]}
        />

        <div className="space-y-2">
          <p className="uppercase text-xs tracking-[0.5em] text-gold">Course Details & Payment</p>
          <h1 className="text-4xl font-playfair">{course.title}</h1>
          {isRegistrationPayment ? (
            <p className="text-base text-mist">Pay KES {formatKES(registrationFeeKES)} to reserve your place.</p>
          ) : null}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <img
              src={course.image}
              alt={`${course.title} course`}
              className="h-56 w-full object-cover"
              width="900"
              height="520"
            />
            <div className="space-y-5 p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-ivory/80">{course.summary}</p>
              {course.schedule ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gold/70">Schedule</p>
                  <p className="mt-2 text-sm text-ivory/80">{course.schedule}</p>
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-gold/70">Level</p>
                  <p className="text-sm text-ivory">{course.level}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-gold/70">Duration</p>
                  <p className="text-sm text-ivory">{course.duration}</p>
                </div>
                {course.mode ? (
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-gold/70">Mode</p>
                    <p className="text-sm text-ivory">{course.mode}</p>
                  </div>
                ) : null}
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-gold/70">School fee</p>
                  <p className="text-sm font-semibold text-gold">KES {formatKES(course.course_fee)}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            id="payment"
            ref={paymentSectionRef}
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-charcoal/60 p-8 space-y-6"
          >
            <h2 className="text-2xl font-playfair text-ivory">
              {isRegistrationPayment ? 'Book your slot' : 'Secure your seat'}
            </h2>

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
                {isRegistrationPayment ? (
                  <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                    <span className="text-mist">Registration fee</span>
                    <span className="font-semibold text-gold">KES {formatKES(registrationFeeKES)}</span>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-mist">School fee</span>
                      <span className="font-semibold text-ivory">KES {formatKES(course.course_fee)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-mist">Additional fees</span>
                      <span className="font-semibold text-ivory">KES {formatKES(separateFeesKES)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                      <span className="font-semibold text-ivory">Total</span>
                      <span className="text-xl font-playfair text-gold">KES {formatKES(subtotalKES)}</span>
                    </div>
                  </div>
                )}
              </div>

              {!isRegistrationPayment && (
                <>
                  <fieldset className="space-y-2">
                    <legend className="mb-2 text-xs uppercase tracking-[0.3em] text-gold/70">Payment option</legend>
                    <label className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-ivory hover:border-gold cursor-pointer">
                      <span className="font-semibold">Full payment — KES {formatKES(subtotalKES)}</span>
                      <input
                        type="radio"
                        checked={selectedOption === 'full'}
                        onChange={() => setSelectedOption('full')}
                        className="h-4 w-4 accent-gold"
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-ivory hover:border-gold cursor-pointer">
                      <span className="font-semibold">
                        Two installments — KES {formatKES(Math.ceil(subtotalKES / 2))} now
                      </span>
                      <input
                        type="radio"
                        checked={selectedOption === 'half'}
                        onChange={() => setSelectedOption('half')}
                        className="h-4 w-4 accent-gold"
                      />
                    </label>
                  </fieldset>
                </>
              )}

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
                {isSubmitting
                  ? 'Processing...'
                  : `${isRegistrationPayment ? 'Pay Registration Fee' : 'Pay '} - KES ${formatKES(amountKES)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
