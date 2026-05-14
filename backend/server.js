import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 10000
const paystackSecret = process.env.PAYSTACK_SECRET_KEY?.trim()
const callbackUrl = process.env.PAYSTACK_CALLBACK_URL?.trim()
const clientOrigin = process.env.CLIENT_ORIGIN || ''

const fallbackProdOrigins = ['https://www.tajiluxuryevents.com', 'https://tajiluxuryevents.com']
const fallbackDevOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']
const allowedOrigins = clientOrigin.split(',').map((origin) => origin.trim()).filter(Boolean)
const allowAll = allowedOrigins.includes('*')
const normalizedOrigins = new Set([...allowedOrigins, ...fallbackProdOrigins, ...fallbackDevOrigins])

app.disable('x-powered-by')

app.use(cors({
  origin: (origin, callback) => {
    if (allowAll || !origin || normalizedOrigins.has(origin)) return callback(null, true)
    return callback(null, false)
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '50kb' }))

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ status: false, message: 'Invalid JSON request body' })
  }
  return next(error)
})

const getConfigStatus = () => ({
  paystackSecretConfigured: Boolean(paystackSecret),
  callbackUrlConfigured: Boolean(callbackUrl),
  allowedOrigins: Array.from(normalizedOrigins),
})

const parsePaystackResponse = async (response) => {
  const text = await response.text()
  try {
    return text ? JSON.parse(text) : {}
  } catch {
    return { status: false, message: text || 'Invalid Paystack response' }
  }
}

const requirePaystackSecret = (res) => {
  if (paystackSecret) return true
  res.status(500).json({
    status: false,
    message: 'Payment gateway is not configured. PAYSTACK_SECRET_KEY is missing on the backend.',
  })
  return false
}

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'taji-payments-api',
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'taji-payments-api',
    config: getConfigStatus(),
  })
})

app.post('/api/paystack/initialize', async (req, res) => {
  try {
    if (!requirePaystackSecret(res)) return

    const { amount, email, name, courseTitle } = req.body || {}
    const numericAmount = Number(amount)
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        status: false,
        message: 'A valid email and amount are required',
      })
    }

    const amountInSubunit = Math.round(numericAmount * 100)
    const reference = `taji_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    const payload = {
      email: normalizedEmail,
      amount: amountInSubunit,
      currency: 'KES',
      reference,
      metadata: {
        customer_name: String(name || 'Customer').trim(),
        course: String(courseTitle || 'Academy course').trim(),
      },
    }

    if (callbackUrl) payload.callback_url = callbackUrl

    console.log(`Initializing Paystack transaction ${reference} for ${normalizedEmail}`)

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await parsePaystackResponse(response)

    if (!response.ok || result.status !== true) {
      console.error('Paystack initialize error:', result)
      return res.status(response.status || 400).json({
        status: false,
        message: result.message || 'Failed to initialize payment',
      })
    }

    return res.json({
      status: true,
      access_code: result.data.access_code,
      reference: result.data.reference,
      authorization_url: result.data.authorization_url,
    })
  } catch (error) {
    console.error('Initialize server error:', error)
    return res.status(500).json({
      status: false,
      message: 'Payment gateway request failed',
    })
  }
})

app.get('/api/paystack/verify/:reference', async (req, res) => {
  try {
    if (!requirePaystackSecret(res)) return

    const reference = String(req.params.reference || '').trim()
    if (!reference) {
      return res.status(400).json({ status: false, message: 'Payment reference is required' })
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    })

    const result = await parsePaystackResponse(response)

    if (!response.ok || result.status !== true) {
      return res.status(response.status || 400).json({
        status: false,
        message: result.message || 'Payment verification failed',
      })
    }

    return res.json({
      status: result.data?.status === 'success',
      data: result.data,
      message: result.message,
    })
  } catch (error) {
    console.error('Verify error:', error)
    return res.status(500).json({ status: false, message: 'Verification failed' })
  }
})

app.post('/api/paystack/mpesa', (req, res) => {
  res.status(410).json({
    status: false,
    message: 'This endpoint is deprecated. Use /api/paystack/initialize instead.',
  })
})

app.use((req, res) => {
  res.status(404).json({ status: false, message: 'Route not found' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend running on port ${port}`)
  console.log(`Paystack configured: ${Boolean(paystackSecret)}`)
})
