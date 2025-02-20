import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  // Form states
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [riderNote, setRiderNote] = useState("");

  // Calculate prices
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 1.79;
  const serviceCharge = 0.99;
  const total = subtotal + deliveryFee + serviceCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryAddress.trim()) {
      alert("Please enter your delivery address");
      return;
    }

    try {
      // Save cart items first
      for (const item of cartItems) {
        await axios.post(
          "http://localhost:3001/api/carts",
          {
            product_id: item.id,
            quantity: item.quantity,
            note: item.note,
          },
          {
            withCredentials: true,
          }
        );
      }

      // Create order
      const orderResponse = await axios.post(
        "http://localhost:3001/api/orders",
        {
          user_id: user?.id,
          sub_total: subtotal,
          delivery_fee: deliveryFee,
          service_charge: serviceCharge,
          total: total,
          delivery_address: deliveryAddress,
          rider_note: riderNote,
        },
        {
          withCredentials: true,
        }
      );

      // Create order products
      await axios.post(
        `http://localhost:3001/api/order-products/bulk`,
        {
          order_id: orderResponse.data.id,
          products: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
        {
          withCredentials: true,
        }
      );

      clearCart();
      navigate("/");
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-gray-50 p-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Personal Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Personal Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">First name</label>
                <input
                  type="text"
                  value={user?.firstname || ""}
                  className="w-full p-2 border rounded"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Last name</label>
                <input
                  type="text"
                  value={user?.lastname || ""}
                  className="w-full p-2 border rounded"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="w-full p-2 border rounded"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={user?.phone_no || ""}
                  className="w-full p-2 border rounded"
                  readOnly
                />
              </div>

              {/* Delivery Address */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  Delivery address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Please add your address"
                  required
                />
              </div>

              {/* Rider Note */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  Note to rider
                </label>
                <textarea
                  value={riderNote}
                  onChange={(e) => setRiderNote(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. building, landmark"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-min self-start">
            <h2 className="text-2xl font-bold mb-6">Your Order</h2>

            {/* Order Items */}
            <div className="mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b"
                >
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery fee</span>
                <span>€{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service charge</span>
                <span>€{serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!deliveryAddress.trim()}
              className={`w-full py-3 rounded ${
                deliveryAddress.trim()
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Place Order (€{total.toFixed(2)})
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
