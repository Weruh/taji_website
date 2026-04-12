import crypto from 'crypto'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 10000
const paystackSecret = process.env.PAYSTACK_SECRET_KEY
const callbackUrl = process.env.PAYSTACK_CALLBACK_URL
const clientOrigin = process.env.CLIENT_ORIGIN || ''
const fallbackProdOrigins = ['https://www.tajiluxuryevents.com', 'https://tajiluxuryevents.com']

// --- THE CRITICAL FIX: Ensure format is ALWAYS 07XXXXXXXX ---
const normalizeKenyanPhone = (value) => {
    let digits = String(value || '').replace(/\D/g, '') // Remove spaces, +, etc.
    
    // If it's 2547... (12 digits), convert to 07...
    if (digits.length === 12 && digits.startsWith('254')) {
        return `0${digits.slice(3)}`
    }
    // If it's already 07... or 01... (10 digits), return it
    if (digits.length === 10 && digits.startsWith('0')) {
        return digits
    }
    // If it's 7... or 1... (9 digits), add the leading 0
    if (digits.length === 9 && (digits.startsWith('7') || digits.startsWith('1'))) {
        return `0${digits}`
    }
    return '' // Invalid format
}

const allowedOrigins = clientOrigin.split(',').map((o) => o.trim()).filter(Boolean)
const allowAll = allowedOrigins.includes('*') || allowedOrigins.length === 0
const normalizedOrigins = new Set(allowedOrigins)
fallbackProdOrigins.forEach((o) => normalizedOrigins.add(o))

app.use(cors({
    origin: (origin, callback) => {
        if (allowAll || !origin || normalizedOrigins.has(origin)) return callback(null, true)
        return callback(null, false)
    },
    methods: ['GET', 'POST', 'OPTIONS'],
}))

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.post('/api/paystack/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    if (!paystackSecret) return res.status(500).send('Missing Secret Key')
    const signature = req.headers['x-paystack-signature']
    const hash = crypto.createHmac('sha512', paystackSecret).update(req.body).digest('hex')
    if (hash !== signature) return res.status(400).send('Invalid signature')
    res.sendStatus(200)
})

app.use(express.json())

app.post('/api/paystack/mpesa', async (req, res) => {
    try {
        const { amount, email, phone, name, courseSlug, courseTitle, paymentPlan, currency } = req.body || {}

        // 1. Convert to LOCAL format (07XXXXXXXX)
        const normalizedPhone = normalizeKenyanPhone(phone)
        console.log(`Log: Input [${phone}] -> Formatted for Paystack [${normalizedPhone}]`)

        if (!normalizedPhone) {
            return res.status(400).json({ status: false, message: 'Invalid phone number. Use 07XXXXXXXX format.' })
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
                phone: normalizedPhone, 
                provider: 'mpesa',
            },
            metadata: { name, course_slug: courseSlug, course_title: courseTitle, payment_plan: paymentPlan },
        }

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
            console.error('Paystack API Error:', JSON.stringify(result, null, 2))
            return res.status(400).json({
                status: false,
                message: result.message || 'Transaction rejected by payment provider',
                error_code: result.data?.code
            })
        }

        res.json({ status: true, message: result.message, data: result.data })

    } catch (error) {
        console.error('Server Crash:', error)
        res.status(500).json({ status: false, message: 'Internal server error.' })
    }
})

app.get('/api/paystack/verify/:reference', async (req, res) => {
    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${req.params.reference}`, {
            headers: { Authorization: `Bearer ${paystackSecret}` },
        })
        const result = await response.json()
        res.status(response.status).json(result)
    } catch (error) {
        res.status(500).json({ status: false, message: 'Verification failed.' })
    }
})

app.listen(port, () => console.log(`Backend running on port ${port}`))