import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import OrderTimeline from "../components/OrderTimeline";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders/my-orders");
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getPaymentBadge = (status) => {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Failed") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const getOrderBadge = (status) => {
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    if (status === "Shipped") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      <Navbar />

      <div className="px-6 md:px-12 py-12">
        <div className="mb-12">
          <p className="text-[#c9a24d] uppercase tracking-[0.3em] font-bold text-sm">
            Orders
          </p>
          <h1 className="text-5xl font-extrabold mt-4">My Orders</h1>
          <p className="text-gray-500 mt-3 text-lg">
            Track your luxury fragrance purchases and delivery updates.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading orders..." />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders found"
            message="You have not placed any orders yet."
            buttonText="Start Shopping"
            onClick={() => (window.location.href = "/")}
          />
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-[36px] shadow-xl border border-black/5 p-6 md:p-8"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-6 border-b pb-6">
                  <div>
                    <p className="text-[#c9a24d] uppercase tracking-widest text-xs font-bold">
                      Order #{order._id.slice(-8)}
                    </p>

                    <h2 className="text-2xl font-extrabold mt-2">
                      Luxury Perfume Order
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 lg:items-start">
                    <span
                      className={`px-5 py-2 rounded-full text-sm font-bold ${getPaymentBadge(
                        order.paymentStatus
                      )}`}
                    >
                      Payment: {order.paymentStatus}
                    </span>

                    <span
                      className={`px-5 py-2 rounded-full text-sm font-bold ${getOrderBadge(
                        order.orderStatus
                      )}`}
                    >
                      Status: {order.orderStatus}
                    </span>
                  </div>
                </div>

                <OrderTimeline status={order.orderStatus} />

                <div className="mt-8">
                  <h3 className="text-2xl font-extrabold mb-5">
                    Ordered Items
                  </h3>

                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.product}
                        className="flex flex-col md:flex-row md:items-center gap-5 bg-[#faf7f2] rounded-3xl p-5"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-28 h-28 object-contain rounded-2xl bg-white"
                        />

                        <div className="flex-1">
                          <h4 className="text-xl font-extrabold">
                            {item.name}
                          </h4>

                          <p className="text-gray-500 mt-1">
                            Quantity: {item.quantity}
                          </p>

                          <p className="text-gray-500">
                            Unit Price: ₹{item.price}
                          </p>
                        </div>

                        <div className="text-2xl font-extrabold">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  <div className="bg-[#faf7f2] rounded-3xl p-6">
                    <h3 className="font-extrabold text-xl mb-4">
                      Delivery Address
                    </h3>

                    <div className="text-gray-600 space-y-1">
                      <p className="font-bold text-black">
                        {order.shippingAddress?.fullName}
                      </p>
                      <p>{order.shippingAddress?.phone}</p>
                      <p>
                        {order.shippingAddress?.address},{" "}
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state} -{" "}
                        {order.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black text-white rounded-3xl p-6">
                    <h3 className="font-extrabold text-xl mb-4">
                      Payment Summary
                    </h3>

                    <div className="flex justify-between text-gray-300 mb-3">
                      <span>Payment Method</span>
                      <span>{order.paymentMethod}</span>
                    </div>

                    <div className="flex justify-between text-gray-300 mb-3">
                      <span>Payment Status</span>
                      <span>{order.paymentStatus}</span>
                    </div>

                    <hr className="border-white/10 my-5" />

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Total</span>
                      <span className="text-3xl font-extrabold text-[#c9a24d]">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;