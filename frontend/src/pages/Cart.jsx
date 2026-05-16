import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await API.get("/cart");

      setCart(res.data);
    } catch (error) {
      toast.error("Please login first");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await API.put("/cart", {
        productId,
        quantity,
      });

      fetchCart();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);

      toast.success("Item removed");

      fetchCart();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const items = cart?.items || [];

  const subtotal =
    cart?.totalAmount ||
    items.reduce((total, item) => {
      const price =
        item.product.discountPrice || item.product.price;

      return total + price * item.quantity;
    }, 0);

  const shipping = subtotal > 2999 ? 0 : 199;

  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      <Navbar />

      <div className="px-6 md:px-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#c9a24d] uppercase tracking-[0.3em] font-bold text-sm">
            Your Cart
          </p>

          <h1 className="text-5xl font-extrabold mt-4">
            Shopping Bag
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Review your luxury fragrance selections.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your cart..." />
        ) : items.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            message="Add premium perfumes to continue shopping."
            buttonText="Shop Now"
            onClick={() => (window.location.href = "/")}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Left */}
            <div className="xl:col-span-2 space-y-6">
              {items.map((item) => {
                const price =
                  item.product.discountPrice ||
                  item.product.price;

                return (
                  <div
                    key={item.product._id}
                    className="bg-white rounded-[32px] shadow-lg p-6 border border-black/5 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition"
                  >
                    {/* Image */}
                    <div className="bg-[#faf7f2] rounded-3xl p-4 flex items-center justify-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-44 h-44 object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[#c9a24d] uppercase tracking-[0.25em] text-xs font-bold">
                          {item.product.brand}
                        </p>

                        <h2 className="text-3xl font-extrabold mt-2">
                          {item.product.name}
                        </h2>

                        <div className="flex gap-5 mt-4 text-gray-500">
                          <span>{item.product.size}</span>
                          <span>{item.product.gender}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-5">
                          <span className="text-3xl font-extrabold">
                            ₹{price}
                          </span>

                          {item.product.discountPrice && (
                            <span className="line-through text-gray-400 text-lg">
                              ₹{item.product.price}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mt-8">
                        {/* Quantity */}
                        <div className="flex items-center bg-[#faf7f2] rounded-2xl w-fit overflow-hidden border">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="px-5 py-3 text-xl font-bold hover:bg-black hover:text-white transition"
                          >
                            −
                          </button>

                          <span className="px-6 font-bold text-lg">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="px-5 py-3 text-xl font-bold hover:bg-black hover:text-white transition"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() =>
                            removeItem(item.product._id)
                          }
                          className="text-red-500 font-bold hover:text-red-700 transition"
                        >
                          Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Summary */}
            <div className="sticky top-28 h-fit">
              <div className="bg-white rounded-[36px] shadow-xl p-8 border border-black/5">
                <h2 className="text-3xl font-extrabold mb-8">
                  Order Summary
                </h2>

                {/* Summary Rows */}
                <div className="space-y-5">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>

                    <span>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>

                    <span className="text-green-600 font-bold">
                      Applied
                    </span>
                  </div>
                </div>

                <hr className="my-8" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-extrabold">
                    Total
                  </span>

                  <span className="text-3xl font-extrabold">
                    ₹{total}
                  </span>
                </div>

                {/* Checkout */}
                <button
                  onClick={() =>
                    (window.location.href = "/checkout")
                  }
                  className="w-full mt-8 bg-black text-white py-5 rounded-2xl font-extrabold text-lg hover:bg-[#c9a24d] hover:text-black transition-all duration-300"
                >
                  Proceed To Checkout
                </button>

                {/* Features */}
                <div className="mt-8 space-y-4 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <span>🚚</span>
                    <span>Free delivery on orders above ₹2999</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>🔒</span>
                    <span>100% secure payments</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>✨</span>
                    <span>Premium luxury packaging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;