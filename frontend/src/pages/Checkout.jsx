import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import API from "../services/api";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const items = cart?.items || [];

  const subtotal =
    cart?.totalAmount ||
    items.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);

  const shipping = subtotal > 2999 ? 0 : 199;
  const total = subtotal + shipping;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    try {
      const res = await API.post("/orders/create-razorpay-order", {
        shippingAddress,
      });

      const { order, razorpayOrder, key } = res.data;
      const user = JSON.parse(localStorage.getItem("user"));

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "AromaLux",
        description: "Luxury Perfume Purchase",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            await API.post("/orders/verify-payment", {
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful");
            window.location.href = "/my-orders";
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: user?.name || shippingAddress.fullName,
          email: user?.email || "",
          contact: shippingAddress.phone,
        },

        theme: {
          color: "#c9a24d",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  const placeCODOrder = async () => {
    try {
      await API.post("/orders/cod", {
        shippingAddress,
      });

      toast.success("Order placed successfully");
      window.location.href = "/my-orders";
    } catch (error) {
      toast.error(error.response?.data?.message || "COD order failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (paymentMethod === "cod") {
      placeCODOrder();
    } else {
      handlePayment();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      <Navbar />

      <div className="px-6 md:px-12 py-12">
        <div className="mb-12">
          <p className="text-[#c9a24d] uppercase tracking-[0.3em] font-bold text-sm">
            Secure Checkout
          </p>

          <h1 className="text-5xl font-extrabold mt-4">
            Complete Your Order
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Premium fragrances delivered securely to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[40px] shadow-xl border border-black/5 p-8 md:p-10"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-extrabold">
                  Shipping Information
                </h2>

                <div className="bg-[#faf7f2] px-5 py-3 rounded-2xl text-sm font-bold">
                  🔒 Secure Checkout
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 font-bold">Full Name</label>
                  <input
                    name="fullName"
                    placeholder="John Doe"
                    value={shippingAddress.fullName}
                    onChange={handleChange}
                    className="w-full border border-black/10 p-4 rounded-2xl outline-none focus:border-[#c9a24d]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-bold">Phone Number</label>
                  <input
                    name="phone"
                    placeholder="+91 9876543210"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    className="w-full border border-black/10 p-4 rounded-2xl outline-none focus:border-[#c9a24d]"
                    required
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="block mb-2 font-bold">Full Address</label>
                <textarea
                  name="address"
                  placeholder="Enter your full delivery address"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  className="w-full border border-black/10 p-4 rounded-2xl outline-none focus:border-[#c9a24d]"
                  rows="5"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                <div>
                  <label className="block mb-2 font-bold">City</label>
                  <input
                    name="city"
                    placeholder="Mumbai"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    className="w-full border border-black/10 p-4 rounded-2xl outline-none focus:border-[#c9a24d]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-bold">State</label>
                  <input
                    name="state"
                    placeholder="Maharashtra"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    className="w-full border border-black/10 p-4 rounded-2xl outline-none focus:border-[#c9a24d]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-bold">Pincode</label>
                  <input
                    name="pincode"
                    placeholder="400001"
                    value={shippingAddress.pincode}
                    onChange={handleChange}
                    className="w-full border border-black/10 p-4 rounded-2xl outline-none focus:border-[#c9a24d]"
                    required
                  />
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-extrabold mb-6">
                  Payment Method
                </h3>

                <div className="space-y-5">
                  <div
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`border-2 rounded-3xl p-6 flex items-center justify-between cursor-pointer transition ${
                      paymentMethod === "razorpay"
                        ? "border-[#c9a24d] bg-[#faf7f2]"
                        : "border-black/10 bg-white"
                    }`}
                  >
                    <div>
                      <h4 className="font-extrabold text-lg">
                        Razorpay Secure Payment
                      </h4>

                      <p className="text-gray-500 mt-1">
                        UPI, Cards, Wallets & Net Banking
                      </p>
                    </div>

                    <div className="text-3xl">💳</div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`border-2 rounded-3xl p-6 flex items-center justify-between cursor-pointer transition ${
                      paymentMethod === "cod"
                        ? "border-[#c9a24d] bg-[#faf7f2]"
                        : "border-black/10 bg-white"
                    }`}
                  >
                    <div>
                      <h4 className="font-extrabold text-lg">
                        Cash On Delivery
                      </h4>

                      <p className="text-gray-500 mt-1">
                        Pay when your order arrives
                      </p>
                    </div>

                    <div className="text-3xl">📦</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
                <div className="bg-[#faf7f2] rounded-3xl p-5">
                  <div className="text-3xl mb-3">🚚</div>
                  <h4 className="font-extrabold">Fast Delivery</h4>
                  <p className="text-gray-500 text-sm mt-2">
                    Delivery within 3-5 business days.
                  </p>
                </div>

                <div className="bg-[#faf7f2] rounded-3xl p-5">
                  <div className="text-3xl mb-3">🔒</div>
                  <h4 className="font-extrabold">Secure Payment</h4>
                  <p className="text-gray-500 text-sm mt-2">
                    100% encrypted payment protection.
                  </p>
                </div>

                <div className="bg-[#faf7f2] rounded-3xl p-5">
                  <div className="text-3xl mb-3">✨</div>
                  <h4 className="font-extrabold">Luxury Packaging</h4>
                  <p className="text-gray-500 text-sm mt-2">
                    Premium fragrance packaging experience.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-10 bg-black text-white py-5 rounded-2xl font-extrabold text-lg hover:bg-[#c9a24d] hover:text-black transition-all duration-300"
              >
                {paymentMethod === "cod"
                  ? "Place COD Order"
                  : "Proceed To Payment"}
              </button>
            </form>
          </div>

          <div className="sticky top-28 h-fit">
            <div className="bg-white rounded-[40px] shadow-xl border border-black/5 p-8">
              <h2 className="text-3xl font-extrabold mb-8">
                Order Summary
              </h2>

              <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product._id} className="flex gap-4">
                    <div className="bg-[#faf7f2] rounded-2xl p-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-extrabold line-clamp-1">
                        {item.product.name}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        Qty: {item.quantity}
                      </p>

                      <p className="font-bold mt-2">
                        ₹{item.product.discountPrice || item.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-8" />

              <div className="space-y-5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span>Included</span>
                </div>
              </div>

              <hr className="my-8" />

              <div className="flex justify-between items-center">
                <span className="text-2xl font-extrabold">Total</span>
                <span className="text-3xl font-extrabold">₹{total}</span>
              </div>

              <div className="mt-8 bg-[#faf7f2] rounded-3xl p-5 text-sm text-gray-600">
                🔒 Your payment information is processed securely.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;