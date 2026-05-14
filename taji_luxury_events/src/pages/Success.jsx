import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'

export default function Success() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference') || searchParams.get('ref')
  
  const [isVerifying, setIsVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')

  const apiBase = import.meta.env.VITE_API_BASE?.trim() || 'https://taji-website.onrender.com'

  // Optional: Verify payment with backend
  useEffect(() => {
    if (!reference) {
      setError("No payment reference found")
      setIsVerifying(false)
      return
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`${apiBase}/api/paystack/verify/${reference}`)
        const data = await res.json()

        if (data.status === true && data.data?.status === 'success') {
          setVerified(true)
        } else {
          setError(data.message || "Payment verification failed")
        }
      } catch (err) {
        console.error(err)
        setError("Could not verify payment. Please check your email.")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [reference])

  return (
    <section className="px-3 sm:px-4 lg:px-6 py-20 min-h-screen bg-charcoal/90 flex items-center">
      <div className="max-w-2xl mx-auto text-center space-y-8" data-aos="fade-up">
        <Breadcrumbs
          crumbs={[
            { label: 'Home', url: '/' },
            { label: 'Academy', url: '/academy' },
            { label: 'Success' },
          ]}
        />

        <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <span className="text-6xl">🎉</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-playfair text-ivory">Payment Successful!</h1>
          <p className="text-xl text-mist">
            Thank you for enrolling. We've sent a confirmation email with your receipt.
          </p>
        </div>

        {isVerifying && (
          <p className="text-gold">Verifying your payment...</p>
        )}

        {verified && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
            <p className="text-emerald-100 text-lg">
              ✅ Your payment has been confirmed successfully.
            </p>
            {reference && (
              <p className="text-sm text-mist mt-3">
                Reference: <span className="font-mono text-gold">{reference}</span>
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-rose-100">
            <p>{error}</p>
          </div>
        )}

        <div className="pt-6 space-y-4">
          <Link
            to="/academy"
            className="inline-block bg-gold hover:bg-amber-400 transition text-charcoal font-semibold px-10 py-4 rounded-full text-lg"
          >
            Browse More Courses
          </Link>

          <div>
            <Link
              to="/"
              className="text-mist hover:text-ivory transition underline"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
