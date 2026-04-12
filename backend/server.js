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

// --- HELPER: PHONE NORMALIZATION (Converts to LOCAL 07... format) ---
const normalizeKenyanPhone = (value) => {
    let digits = String(value || '').replace(/\D/g, '') // Remove spaces, +, etc.
    
    // If user typed 2547XXXXXXXX (12 digits), convert to 07XXXXXXXX
    if (digits.length === 12 && digits.startsWith('254')) {
        return `0${digits.slice(3)}`
    }
    // If user typed 07XXXXXXXX (10 digits), it's already correct
    if (digits.length === 10 && digits.startsWith('0')) {
        return digits
    }
    // If user typed 7XXXXXXXX (9 digits), add the leading 0
    if (digits.length === 9 && (digits.startsWith('7') || digits.startsWith('1'))) {
        return `0${digits}`
    }
    return '' // Invalid format
}

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
            if (allowAll || !origin || normalizedOrigins.has(origin)) {
                return callback(null, true)
            }
            return callback(null, false)
        },
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)

app.get('/health', (req, res) => { res.json({ status: 'ok' }) })

app.post('/api/paystack/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    if (!paystackSecret) return res.status(500).send('Missing Secret Key')
    const signature = req.headers['x-paystack-signature']
    const hash = crypto.createHmac('sha512', paystackSecret).update(req.body).digest('hex')
    if (hash !== signature) return res.status(400).send('Invalid signature')
    res.sendStatus(200)
})

app.use(express.json())

// MAIN MPESA CHARGE ROUTE
app.post('/api/paystack/mpesa', async (req, res) => {
    try {
        const { amount, email, phone, name, courseSlug, courseTitle, paymentPlan, currency } = req.body || {}

        // 1. Normalize to LOCAL format (07...)
        const normalizedPhone = normalizeKenyanPhone(phone)
        
        if (!normalizedPhone) {
            console.error('Normalization failed for:', phone)
            return res.status(400).json({ status: false, message: 'Invalid phone format. Please use 07XXXXXXXX.' })
        }

        const amountInSubunit = Math.round(Number(amount) * 100)
        const reference = `taji_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

        const payload = {
            email,
            amount: amountInSubunit,
            currency: currency || 'KES',
            reference,
            callback_url: callbackUrl,
            mobile_money: {
                phone: normalizedPhone, // Now sends 07XXXXXXXX
                provider: 'mpesa',
            },
            metadata: { name, course_slug: courseSlug, course_title: courseTitle, payment_plan: paymentPlan },
        }

        console.log('Sending to Paystack:', normalizedPhone)

        const response = await fetch('https://api.paystack.co/charge', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${paystackSecret}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        const result = await response.json()

        if (!response.ok || result.status === false) {
            console.error('Paystack API Error Response:', JSON.stringify(result, null, 2))
            return res.status(400).json({
                status: false,
                message: result.message || 'Paystack rejected the request',
                details: result.data // This helps see exactly what Paystack disliked
            })
        }

        res.json({ status: true, message: result.message, data: result.data })

    } catch (error) {
        console.error('Backend Crash Error:', error)
        res.status(500).json({ status: false, message: 'Internal server error.' })
    }
})

app.get('/api/paystack/verify/:reference', async (req, res) => {
    const { reference } = req.params
    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${paystackSecret}` },
        })
        const result = await response.json()
        res.status(response.status).json(result)
    } catch (error) {
        res.status(500).json({ status: false, message: 'Verification failed.' })
    }
})

app.listen(port, () => { console.log(`Server running on port ${port}`) })