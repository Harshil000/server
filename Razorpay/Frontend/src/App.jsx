import axios from "axios"
import { useRazorpay } from "react-razorpay"

const App = () => {

  const { error, isLoading, Razorpay } = useRazorpay()

  async function validatePayment(res) {
    const {data} = await axios.post('/api/paymentValidation', res)
    return data
  }

  async function handlePayment() {
    const { data } = await axios.get('/api/payment')
    console.log(data)

    const options = {
      key: "rzp_test_TRtZKdYhSLSwN5",
      amount: data.order.amount, // Amount returned from backend
      currency: data.order.currency, // Currency returned from backend
      name: "Test Company",
      description: "Test Transaction",
      order_id: data.order.id, // Dynamic order_id created by server
      handler: async (response) => {
        console.log(response);
        const isValid = await validatePayment(response)
        if (isValid.success) {
          alert("Payment Successful!")
        }
        else {
          alert("Payment Failed!")
        }
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }

  return (
    <>
      <button onClick={handlePayment}>
        Pay
      </button>
    </>
  )
}

export default App