// src/pages/Payment.jsx
import React, { useState } from 'react';
import { useCart } from '../components/CartContext';

const Payment = () => {
  const { totalPrice } = useCart();
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expirationDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically process the payment
    console.log('Processing payment:', paymentInfo);
    alert('Payment processed successfully!');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-10">Payment</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-300">Card Holder</label>
            <input
              type="text"
              id="cardHolder"
              name="cardHolder"
              value={paymentInfo.cardHolder}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-300">Expiration Date</label>
              <input
                type="text"
                id="expirationDate"
                name="expirationDate"
                value={paymentInfo.expirationDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-300">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white"
                required
              />
            </div>
          </div>
          <div className="mt-8">
            <p className="text-2xl font-bold mb-4">Total: ${totalPrice.toFixed(2)}</p>
            <button
              type="submit"
              className="w-full bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;