// src/pages/Cart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { Plus, Minus } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-[#121212] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-10">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-6 border-b border-gray-700 pb-6">
                <div className="flex items-center">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-20 h-20 object-cover mr-4" />
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-400">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 bg-gray-700 rounded">
                    <Minus size={16} />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 bg-gray-700 rounded">
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-8 flex justify-between items-center">
              <p className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
              <Link
                to="/payment"
                className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
              >
                Proceed to Payment
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;