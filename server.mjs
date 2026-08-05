import express from 'express'
import Razorpay from 'razorpay'
import Stripe from 'stripe'
import crypto from 'crypto'
import cors from 'cors'

const app = express()
app.use(cors())

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null

app.post('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured' })
  }

  const sig = req.headers['stripe-signature']
  if (!sig || !STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    console.log(`PaymentIntent ${paymentIntent.id} succeeded at ${new Date(paymentIntent.created * 1000).toISOString()}`)
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object
    console.log(`PaymentIntent ${paymentIntent.id} failed at ${new Date().toISOString()}`)
  }

  res.json({ received: true })
})

app.use(express.json())

const razorpay = new Razorpay({
  key_id: 'rzp_test_THG2PBUwAQ3U9c',
  key_secret: 'ND377Ai9cN0rv8Q1lI0T7KVs',
})

const KEY_SECRET = 'ND377Ai9cN0rv8Q1lI0T7KVs'
const BACKEND_URL = 'https://stay-easy-sizw.onrender.com'

app.post('/api/v1/payments/create-order', async (req, res) => {
  try {
    const { amount, hotelId } = req.body
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${hotelId}_${Date.now()}`,
    }
    const order = await razorpay.orders.create(options)
    res.json({
      orderId: order.id,
      amount: Number(order.amount) / 100,
      currency: order.currency,
    })
  } catch (err) {
    console.error('Create order error:', err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

app.post('/api/v1/payments/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(body)
      .digest('hex')
    const isValid = expectedSignature === razorpay_signature
    if (isValid) {
      res.json({ success: true })
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' })
    }
  } catch (err) {
    console.error('Verify error:', err)
    res.status(500).json({ error: 'Verification failed' })
  }
})

app.all('/api/{*path}', async (req, res) => {
  try {
    const url = `${BACKEND_URL}${req.originalUrl}`
    const headers = {}
    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization
    }
    const fetchOptions = {
      method: req.method,
      headers: { ...headers, 'Content-Type': 'application/json' },
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body)
    }
    const response = await fetch(url, fetchOptions)
    const data = await response.text()
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(data)
  } catch (err) {
    console.error('Proxy error:', err)
    res.status(502).json({ error: 'Backend unreachable' })
  }
})

const PORT = 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
