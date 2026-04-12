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

// ====================== CORS SETUP ======================
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

app.use(express.json())

// ====================== NEW ENDPOINT - FOR POPUP ======================
app.post('/api/paystack/initialize', async (req, res) => {
    try {
        const { amount, email, name, courseTitle } = req.body || {}

        if (!email || !amount) {
            return res.status(400).json({ 
                status: false, 
                message: 'Email and amount are required' 
            })
        }

        const amountInSubunit = Math.round(Number(amount) * 100)
        const reference = `taji_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

        const payload = {
            email: email.trim().toLowerCase(),
            amount: amountInSubunit,
            currency: 'KES',
            reference,
            callback_url: callbackUrl,
            metadata: {
                customer_name: name || "Customer",
                course: courseTitle || "Event"
            }
        }

        console.log('--- Initializing Paystack Transaction ---')
        console.log(`Reference: ${reference} | Amount: ${amountInSubunit} | Email: ${email}`)

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${paystackSecret}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        const result = await response.json()

        if (result.status === true) {
            return res.json({
                status: true,
                access_code: result.data.access_code,
                reference: result.data.reference,
                authorization_url: result.data.authorization_url
            })
        } else {
            console.error('Paystack Initialize Error:', result)
            return res.status(400).json({
                status: false,
                message: result.message || 'Failed to initialize payment'
            })
        }

    } catch (error) {
        console.error('Initialize Server Error:', error)
        res.status(500).json({ status: false, message: 'Internal server error' })
    }
})

// ====================== (Optional but Recommended) Verify Payment ======================
app.get('/api/paystack/verify/:reference', async (req, res) => {
    try {
        const { reference } = req.params

        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${paystackSecret}`,
            }
        })

        const result = await response.json()

        if (result.status === true && result.data.status === 'success') {
            // Payment successful → You can update your database here
            return res.json({ status: true, data: result.data })
        } else {
            return res.status(400).json({ 
                status: false, 
                message: result.message || 'Payment not successful' 
            })
        }
    } catch (error) {
        console.error('Verify Error:', error)
        res.status(500).json({ status: false, message: 'Verification failed' })
    }
})

// Old endpoint (kept for now in case you need it later)
app.post('/api/paystack/mpesa', (req, res) => {
    res.status(410).json({ 
        status: false, 
        message: 'This endpoint is deprecated. Use /api/paystack/initialize instead for better UX.' 
    })
})

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.listen(port, () => {
    console.log(`Backend running on port ${port}`)
})