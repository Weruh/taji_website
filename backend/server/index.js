import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 4242
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: clientOrigin }))
app.use(express.json())

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const coursesPath = path.join(__dirname, '../../taji_luxury_events/src/data/courses.json')
let coursesCache = null

const loadCourses = async () => {
  if (coursesCache) return coursesCache
  const raw = await fs.readFile(coursesPath, 'utf-8')
  coursesCache = JSON.parse(raw)
  return coursesCache
}

const getCourseAmount = (course, paymentOption) => {
  const total = Number(course.total_fee || 0)
  if (!total) return 0
  if (paymentOption === 'half') {
    return Math.ceil(total / 2)
  }
  return total
}

const requireSecretKey = (res) => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    res.status(500).json({ error: 'Missing PAYSTACK_SECRET_KEY on the server.' })
    return false
  }
  return true
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/', (_req, res) => {
  res.status(200).send('Taji backend is running.')
})

app.post('/api/paystack/initialize', async (req, res) => {
  if (!requireSecretKey(res)) return
  const { email, name, phone, courseSlug, paymentOption } = req.body || {}

  if (!email || !name || !courseSlug) {
    res.status(400).json({ error: 'Missing required fields.' })
    return
  }

  try {
    const courses = await loadCourses()
    const course = courses.find((item) => item.slug === courseSlug)
    if (!course) {
      res.status(404).json({ error: 'Course not found.' })
      return
    }

    const amountKes = getCourseAmount(course, paymentOption)
    if (!amountKes) {
      res.status(400).json({ error: 'Course amount is missing.' })
      return
    }

    const payload = {
      email,
      amount: Math.round(amountKes * 100),
      currency: 'KES',
      callback_url: process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:5173/payment/verify',
      metadata: {
        name,
        phone: phone || '',
        courseSlug,
        courseTitle: course.title,
        paymentOption: paymentOption || 'full',
      },
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok || !data.status) {
      res.status(502).json({
        error: data?.message || 'Failed to initialize Paystack transaction.',
        details: data,
      })
      return
    }

    res.json({
      authorization_url: data.data?.authorization_url,
      reference: data.data?.reference,
      access_code: data.data?.access_code,
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error initializing transaction.' })
  }
})

app.get('/api/paystack/verify/:reference', async (req, res) => {
  if (!requireSecretKey(res)) return
  const { reference } = req.params
  if (!reference) {
    res.status(400).json({ error: 'Missing reference.' })
    return
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })
    const data = await response.json()
    if (!response.ok || !data.status) {
      res.status(502).json({
        error: data?.message || 'Failed to verify Paystack transaction.',
        details: data,
      })
      return
    }

    res.json({
      status: data.data?.status,
      reference: data.data?.reference,
      amount: data.data?.amount,
      currency: data.data?.currency,
      data,
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error verifying transaction.' })
  }
})

app.listen(port, () => {
  console.log(`Paystack server listening on http://localhost:${port}`)
})
