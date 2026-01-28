const axios = require('axios');
require('dotenv').config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const initializePayment = async (email, amount, callbackUrl) => {
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, 
        callback_url: callbackUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error initializing payment:', error.response ? error.response.data : error.message);
    throw new Error('Payment initialization failed');
  }
};

const verifyPayment = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error verifying payment:', error.response ? error.response.data : error.message);
    throw new Error('Payment verification failed');
  }
};

module.exports = { initializePayment, verifyPayment };
