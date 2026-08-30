import express from 'express'
import morgan from 'morgan'
import Razorpay from 'razorpay'
import { config } from 'dotenv'
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js';

config();
const app = express()

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

const createOrder = async ({ amount, currency }) => {
    const options = {
        amount: amount * 100,
        currency: currency,
    }

    try {
        const order = await razorpay.orders.create(options)
        return order;
    } catch (error) {
        console.log(error)
    }
}

app.use(express.json())
app.use(morgan("dev"))

app.get('/', (req, res) => {
    res.send("hi")
})

app.get('/api/payment', async (req, res) => {
    const order = await createOrder({ amount: 1000, currency: "INR" })
    return res.status(200).json({
        message: "order created successfully",
        success: true,
        order
    })
})

app.post('/api/paymentValidation', async (req, res) => {
    const { razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
    } = req.body

    const isPaymentValid = validatePaymentVerification(
        {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
        },
        razorpay_signature,
        process.env.RAZORPAY_KEY_SECRET
    )

    if (isPaymentValid) {
        return res.status(200).json({
            message: "payment is valid",
            success: true
        })
    }
    else {
        return res.status(400).json({
            message: "payment is not valid",
            success: false
        })
    }
})
export default app