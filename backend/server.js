import crypto from 'crypto'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 4242
const paystackSecret = process.env.PAYSTACK_SECRET_KEY
const callbackUrl = process.env.PAYSTACK_CALLBACK_URL
const clientOrigin = process.env.CLIENT_ORIGIN || ''
const fallbackProdOrigins = ['https://www.tajiluxuryevents.com', 'https://tajiluxuryevents.com']

const allowedOrigins = clientOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const allowAll = allowedOrigins.includes('*') || allowedOrigins.length === 0
const normalizedOrigins = new Set(allowedOrigins)
fallbackProdOrigins.forEach((origin) => normalizedOrigins.add(origin))

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowAll) return callback(null, true)
      if (!origin) return callback(null, true)
      if (normalizedOrigins.has(origin)) return callback(null, true)
      return callback(null, false)
    },
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/paystack/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!paystackSecret) {
    return res.status(500).send('Missing PAYSTACK_SECRET_KEY')
  }

  const signature = req.headers['x-paystack-signature']
  const hash = crypto.createHmac('sha512', paystackSecret).update(req.body).digest('hex')

  if (hash !== signature) {
    return res.status(400).send('Invalid signature')
  }

  const event = JSON.parse(req.body.toString('utf8'))
  if (event?.event === 'charge.success') {
    console.log('Paystack charge success', {
      reference: event?.data?.reference,
      amount: event?.data?.amount,
      customer: event?.data?.customer?.email,
    })
  }

  res.sendStatus(200)
})

app.use(express.json())

app.post('/api/paystack/mpesa', async (req, res) => {
  if (!paystackSecret) {
    return res.status(500).json({ status: false, message: 'Missing PAYSTACK_SECRET_KEY' })
  }

  const { amount, email, phone, name, courseSlug, courseTitle, paymentPlan, currency } = req.body || {}

  if (!amount || !email || !phone) {
    return res.status(400).json({ status: false, message: 'Amount, email, and phone are required.' })
  }

  const amountInSubunit = Math.round(Number(amount) * 100)
  if (!Number.isFinite(amountInSubunit) || amountInSubunit <= 0) {
    return res.status(400).json({ status: false, message: 'Amount must be greater than zero.' })
  }

  const reference = `taji_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  const payload = {
    email,
    amount: amountInSubunit,
    currency: currency || 'KES',
    reference,
    callback_url: callbackUrl,
    mobile_money: {
      phone,
      provider: 'mpesa',
    },
    metadata: {
      name,
      course_slug: courseSlug,
      course_title: courseTitle,
      payment_plan: paymentPlan,
    },
  }

  try {
    const response = await fetch('https://api.paystack.co/charge', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok || result?.status === false) {
      return res.status(response.status || 400).json({
        status: false,
        message: result?.message || 'Paystack charge failed',
        data: result?.data,
      })
    }

    res.json({
      status: true,
      message: result?.message || 'Charge attempted',
      data: result?.data,
    })
  } catch (error) {
    res.status(500).json({ status: false, message: 'Unable to reach Paystack.' })
  }
})

app.get('/api/paystack/verify/:reference', async (req, res) => {
  if (!paystackSecret) {
    return res.status(500).json({ status: false, message: 'Missing PAYSTACK_SECRET_KEY' })
  }

  const { reference } = req.params
  if (!reference) {
    return res.status(400).json({ status: false, message: 'Reference is required.' })
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok || result?.status === false) {
      return res.status(response.status || 400).json({
        status: false,
        message: result?.message || 'Verification failed',
        data: result?.data,
      })
    }

    res.json({
      status: true,
      message: result?.message || 'Verification complete',
      data: result?.data,
    })
  } catch (error) {
    res.status(500).json({ status: false, message: 'Unable to verify transaction.' })
  }
})

app.listen(port, () => {
  console.log(`Paystack backend running on port ${port}`)
})
