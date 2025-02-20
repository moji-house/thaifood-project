import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { useState, useEffect } from "react";

interface NoteState {
  [key: number]: string;
}

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, updateNote, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<NoteState>({});
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const deliveryFee = 1.79;
  const serviceCharge = 0.99;

  // Clear cart when user logs out
  useEffect(() => {
    if (!user) {
      clearCart();
    }
  }, [user, clearCart]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryFee + serviceCharge;

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleNoteChange = (itemId: number, note: string) => {
    setNotes({ ...notes, [itemId]: note });
    updateNote(itemId, note);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20">
        <div className="container mx-auto px-4 py-8 w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-8">Your Items</h1>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Cart is empty, please add more items to your cart.</p>
                <Link
                  to="/menu"
                  className="text-red-600 hover:text-red-700 mt-4 inline-block"
                >
                  Continue Order Thai Food
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col border-b py-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-gray-600">€{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        className="text-red-600 hover:text-red-700"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        <FiMinus size={20} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="text-red-600 hover:text-red-700"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        <FiPlus size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    {editingNote === item.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={notes[item.id] || ""}
                          onChange={(e) =>
                            handleNoteChange(item.id, e.target.value)
                          }
                          className="flex-1 border rounded px-2 py-1"
                          placeholder="Add your note here..."
                          maxLength={100}
                        />
                        <button
                          onClick={() => setEditingNote(null)}
                          className="text-sm text-red-600"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingNote(item.id)}
                        className="text-sm text-gray-500 hover:text-red-600"
                      >
                        {notes[item.id] ? "Edit note" : "Add note"}
                      </button>
                    )}
                    {notes[item.id] && editingNote !== item.id && (
                      <p className="text-sm text-gray-500 mt-1">
                        {notes[item.id]}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery fee:</span>
                    <span>€{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service charge:</span>
                    <span>€{serviceCharge.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold border-t pt-4">
                  <span>Total:</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-red-600 text-white text-center py-3 rounded hover:bg-red-700 mt-6"
              >
                {user ? `Checkout (€${total.toFixed(2)})` : "Login to Checkout"}
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
