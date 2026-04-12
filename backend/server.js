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

// --- HELPER: PHONE NORMALIZATION ---
// Converts inputs (07..., +254..., 7...) into the 2547XXXXXXXX format
const normalizeKenyanPhone = (value) => {
    let digits = String(value || '').replace(/\D/g, '') // Remove all non-digits
    
    // If it starts with 07 or 01, replace 0 with 254
    if (digits.length === 10 && digits.startsWith('0')) {
        return `254${digits.slice(1)}`
    }
    // If it's 9 digits (7XXXXXXXX), add 254
    if (digits.length === 9 && (digits.startsWith('7') || digits.startsWith('1'))) {
        return `254${digits}`
    }
    // If it's already 12 digits and starts with 254, return as is
    if (digits.length === 12 && digits.startsWith('254')) {
        return digits
    }
    return '' // Invalid
}

// --- CORS CONFIGURATION ---
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

// --- ROUTES ---

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Webhook Route (Uses raw body for signature verification)
app.post('/api/paystack/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    if (!paystackSecret) return res.status(500).send('Missing Secret Key')

    const signature = req.headers['x-paystack-signature']
    const hash = crypto.createHmac('sha512', paystackSecret).update(req.body).digest('hex')

    if (hash !== signature) return res.status(400).send('Invalid signature')

    const event = JSON.parse(req.body.toString('utf8'))
    if (event?.event === 'charge.success') {
        console.log('Payment Successful:', event.data.reference)
    }
    res.sendStatus(200)
})

// JSON Middleware for standard routes
app.use(express.json())

// MAIN MPESA CHARGE ROUTE
app.post('/api/paystack/mpesa', async (req, res) => {
    try {
        if (!paystackSecret || !callbackUrl) {
            return res.status(500).json({ status: false, message: 'Server configuration error (Keys missing).' })
        }

        const { amount, email, phone, name, courseSlug, courseTitle, paymentPlan, currency } = req.body || {}

        // 1. Validate Input
        if (!amount || !email || !phone) {
            return res.status(400).json({ status: false, message: 'Missing required fields (amount, email, phone).' })
        }

        // 2. Normalize Phone
        const normalizedPhone = normalizeKenyanPhone(phone)
        if (!normalizedPhone) {
            return res.status(400).json({ status: false, message: 'Invalid phone format. Please use 07XXXXXXXX.' })
        }

        const amountInSubunit = Math.round(Number(amount) * 100)
        const reference = `taji_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

        // 3. Prepare Payload
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
            metadata: {
                name,
                course_slug: courseSlug,
                course_title: courseTitle,
                payment_plan: paymentPlan,
            },
        }

        console.log('Sending to Paystack:', normalizedPhone)

        // 4. Call Paystack API
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
            console.error('Paystack Error:', result)
            return res.status(response.status || 400).json({
                status: false,
                message: result.message || 'Transaction failed',
            })
        }

        // Success
        res.json({
            status: true,
            message: result.message,
            data: result.data,
        })

    } catch (error) {
        console.error('Server Error:', error)
        res.status(500).json({ status: false, message: 'Internal server error.' })
    }
})

// VERIFY TRANSACTION ROUTE
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})