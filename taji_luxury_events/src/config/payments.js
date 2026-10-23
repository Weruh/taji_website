const DEFAULT_API_BASE_URL = 'https://taji-website.onrender.com'
const STALE_API_BASE_URLS = new Set([
  'https://tajiluxuryevents.onrender.com',
])

const normalizeUrl = (value) => String(value || '').trim().replace(/\/+$/, '')

const configuredApiBaseUrl = normalizeUrl(import.meta.env.VITE_API_BASE)

export const API_BASE_URL = configuredApiBaseUrl && !STALE_API_BASE_URLS.has(configuredApiBaseUrl)
  ? configuredApiBaseUrl
  : DEFAULT_API_BASE_URL

export const PAYSTACK_PUBLIC_KEY = String(import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '').trim()

let paystackScriptPromise

export const ensurePaystackLoaded = () => {
  if (window.PaystackPop) return Promise.resolve()
  if (paystackScriptPromise) return paystackScriptPromise

  paystackScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v2/inline.js'
    script.async = true

    const timeout = window.setTimeout(() => {
      script.remove()
      reject(new Error('Paystack took too long to load'))
    }, 12000)

    script.onload = () => {
      window.clearTimeout(timeout)
      if (window.PaystackPop) resolve()
      else reject(new Error('Paystack did not initialize'))
    }
    script.onerror = () => {
      window.clearTimeout(timeout)
      reject(new Error('Paystack could not load'))
    }

    document.head.appendChild(script)
  }).catch((error) => {
    paystackScriptPromise = null
    document.querySelector('script[src="https://js.paystack.co/v2/inline.js"]')?.remove()
    throw error
  })

  return paystackScriptPromise
}
