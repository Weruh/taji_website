import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const statusCopy = {
  loading: {
    title: 'Verifying payment',
    body: 'Hang tight while we confirm your transaction with Paystack.',
  },
  success: {
    title: 'Payment confirmed',
    body: 'Thank you! Your payment has been received. We will reach out with next steps.',
  },
  error: {
    title: 'Payment not confirmed',
    body: 'We could not verify the payment. If you were charged, please contact support.',
  },
}

export default function PaymentVerify() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference')
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!reference) {
      setStatus('error')
      setMessage('Missing payment reference.')
      return
    }

    let cancelled = false
    const verify = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE || ''
        const response = await fetch(`${apiBase}/api/paystack/verify/${reference}`)
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload?.error || 'Verification failed.')
        }

        if (payload.status === 'success') {
          if (!cancelled) {
            setStatus('success')
            setMessage('')
          }
          return
        }

        if (!cancelled) {
          setStatus('error')
          setMessage(`Payment status: ${payload.status || 'unknown'}.`)
        }
      } catch (error) {
        if (!cancelled) {
          setStatus('error')
          setMessage(error?.message || 'Verification failed.')
        }
      }
    }

    verify()
    return () => {
      cancelled = true
    }
  }, [reference])

  const copy = statusCopy[status] || statusCopy.loading

  return (
    <section className="px-3 sm:px-4 lg:px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-6" data-aos="fade-up">
        <p className="uppercase text-xs tracking-[0.4em] text-gold/80">Payment</p>
        <h1 className="text-4xl font-playfair text-ivory">{copy.title}</h1>
        <p className="text-sm text-mist">{copy.body}</p>
        {message ? <p className="text-sm text-rose-100">{message}</p> : null}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/academy"
            className="rounded-full border border-gold bg-gold/10 px-5 py-2 text-xs uppercase tracking-[0.4em] text-gold transition hover:bg-gold hover:text-charcoal"
          >
            Back to Academy
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.4em] text-ivory/80 transition hover:border-gold hover:text-gold"
          >
            Contact Us
          </Link>
        </div>
        {reference ? (
          <p className="text-xs text-mist/60">Reference: {reference}</p>
        ) : null}
      </div>
    </section>
  )
}
