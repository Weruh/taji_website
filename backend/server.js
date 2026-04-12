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

// --- THE FIX: We will try the 254 format one last time with strict trimming ---
const normalizeKenyanPhone = (value) => {
    let digits = String(value || '').replace(/\D/g, '').trim()
    
    if (digits.startsWith('0') && digits.length === 10) {
        return '254' + digits.slice(1);
    }
    if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) {
        return '254' + digits;
    }
    if (digits.startsWith('254') && digits.length === 12) {
        return digits;
    }
    return '';
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

app.use(express.json())

app.post('/api/paystack/mpesa', async (req, res) => {
    try {
        const { amount, email, phone, name, courseTitle, currency } = req.body || {}

        const normalizedPhone = normalizeKenyanPhone(phone)
        
        if (!normalizedPhone) {
            return res.status(400).json({ status: false, message: 'Invalid phone format.' })
        }

        const amountInSubunit = Math.round(Number(amount) * 100)
        const reference = `taji_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

        // 2. We use a simpler, cleaner payload
        const payload = {
            email: email.trim(),
            amount: amountInSubunit,
            currency: 'KES',
            reference,
            callback_url: callbackUrl,
            mobile_money: {
                phone: normalizedPhone, 
                provider: 'mpesa',
            },
            // Simplified metadata to prevent validation issues
            metadata: { 
                customer_name: name || "Customer",
                course: courseTitle || "Event"
            },
        }

        console.log(`--- DEBUG: Sending to Paystack ---`)
        console.log(`Phone: ${normalizedPhone} | Amount: ${amountInSubunit} | Currency: KES`)

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
            console.error('PAYSTACK FULL ERROR:', JSON.stringify(result, null, 2))
            return res.status(400).json({
                status: false,
                message: result.message || 'Payment provider rejected the request',
            })
        }

        res.json({ status: true, message: result.message, data: result.data })

    } catch (error) {
        console.error('SERVER CRASH:', error)
        res.status(500).json({ status: false, message: 'Internal server error.' })
    }
})

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.listen(port, () => console.log(`Backend running on port ${port}`))