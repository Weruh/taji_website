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
