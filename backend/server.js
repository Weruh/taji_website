import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;

// 1. CORS Setup
const allowedOrigins = [
  'https://www.tajiluxuryevents.com',
  'https://tajiluxuryevents.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

// 2. Body Parsers
// Webhook first (requires raw body for signature verification)
app.post('/api/paystack/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const signature = req.headers['x-paystack-signature'];
  const hash = crypto.createHmac('sha512', secret).update(req.body).digest('hex');

  if (hash === signature) {
    const event = JSON.parse(req.body.toString('utf-8'));
    if (event.event === 'charge.success') {
      console.log('✅ Payment Success:', event.data.reference);
    }
  }
  res.sendStatus(200);
});

// JSON parser for all other routes
app.use(express.json());

// 3. THE FIX: Phone Number Formatter Function
const formatMpesaNumber = (phone) => {
  // Remove spaces, dashes, and the '+' sign
  let cleaned = phone.replace(/\D/g, '');

  // If it starts with '0', replace '0' with '254' (e.g., 0794... becomes 254794...)
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }

  // If the user only typed 9 digits (e.g., 794...), add '254'
  if (cleaned.length === 9) {
    cleaned = '254' + cleaned;
  }

  return cleaned;
};

// 4. M-Pesa STK Push Route
app.post('/api/paystack/mpesa', async (req, res) => {
  const { amount, email, phone, name } = req.body;

  if (!amount || !email || !phone) {
    return res.status(400).json({ status: false, message: 'Missing fields' });
  }

  // APPLY THE FIX HERE
  const formattedPhone = formatMpesaNumber(phone);
  
  // LOG THIS to your Render console to verify it changed from 07... to 2547...
  console.log(`Original: ${phone} -> Formatted for Paystack: ${formattedPhone}`);

  try {
    const response = await fetch('https://api.paystack.co/charge', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(Number(amount) * 100), // KES to Cents
        currency: 'KES',
        mobile_money: {
          phone: formattedPhone, // Uses the 254... version
          provider: 'mpesa',
        },
        metadata: { name },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Paystack Error Response:', data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));