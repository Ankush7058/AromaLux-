import { useEffect, useState } from "react";
import API from "../services/api";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import { toast } from "react-toastify";
import AdminCharts from "./AdminCharts";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
const [users, setUsers] = useState([]);
const [categoryName, setCategoryName] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    try {
      const productRes = await API.get("/products");
      setProducts(productRes.data);

      const orderRes = await API.get("/orders");
      setOrders(orderRes.data);
      const categoryRes = await API.get("/categories");
setCategories(categoryRes.data);

const userRes = await API.get("/users");
setUsers(userRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = orders.reduce(
    (total, order) => total + order.totalAmount,
    0
  );

  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus });
      toast.success("Order status updated");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };
const addCategory = async () => {
  if (!categoryName.trim()) {
    return toast.error("Category name required");
  }

  try {
    await API.post("/categories", {
      name: categoryName,
    });

    toast.success("Category added");

    setCategoryName("");

    fetchData();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to add category"
    );
  }
};
  const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "products", label: "Products", icon: "🧴" },
  { id: "orders", label: "Orders", icon: "📦" },
  { id: "categories", label: "Categories", icon: "🏷️" },
  { id: "users", label: "Users", icon: "👥" },
  { id: "stock", label: "Low Stock", icon: "⚠️" },
];
  return (
    <div className="min-h-screen bg-[#f8f5ef] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-black text-white min-h-screen sticky top-0 hidden lg:flex flex-col">
        <div className="p-8 border-b border-white/10">
          <h1 className="text-3xl font-extrabold">
            Aroma<span className="text-[#c9a24d]">Lux</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2 tracking-widest">
            ADMIN PANEL
          </p>
        </div>

        <div className="flex-1 p-5 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition ${
                activeTab === item.id
                  ? "bg-[#c9a24d] text-black"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-5 border-t border-white/10">
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-white text-black py-3 rounded-2xl font-bold hover:bg-[#c9a24d] transition"
          >
            Go To Store
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Mobile Header */}
        <div className="lg:hidden bg-black text-white p-5">
          <h1 className="text-2xl font-extrabold">
            Aroma<span className="text-[#c9a24d]">Lux</span> Admin
          </h1>

          <div className="flex gap-3 mt-5 overflow-x-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-5 py-3 rounded-xl whitespace-nowrap font-bold ${
                  activeTab === item.id
                    ? "bg-[#c9a24d] text-black"
                    : "bg-white/10"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-10">
            <div>
              <p className="text-[#c9a24d] uppercase tracking-[0.3em] font-bold text-sm">
                Admin
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold mt-3">
                {activeTab === "dashboard" && "Dashboard Overview"}
                {activeTab === "products" && "Product Management"}
                {activeTab === "orders" && "Order Management"}
                {activeTab === "stock" && "Low Stock Products"}
                {activeTab === "categories" && "Category Management"}
{activeTab === "users" && "User Management"}
              </h1>
            </div>

            {activeTab === "products" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-black text-white px-7 py-4 rounded-2xl font-extrabold hover:bg-[#c9a24d] hover:text-black transition"
              >
                + Add Product
              </button>
            )}
          </div>

          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-3xl shadow p-6 border border-black/5">
                  <div className="text-3xl mb-4">🧴</div>
                  <p className="text-gray-500">Total Products</p>
                  <h2 className="text-4xl font-extrabold mt-2">
                    {products.length}
                  </h2>
                </div>

                <div className="bg-white rounded-3xl shadow p-6 border border-black/5">
                  <div className="text-3xl mb-4">📦</div>
                  <p className="text-gray-500">Total Orders</p>
                  <h2 className="text-4xl font-extrabold mt-2">
                    {orders.length}
                  </h2>
                </div>

                <div className="bg-white rounded-3xl shadow p-6 border border-black/5">
                  <div className="text-3xl mb-4">💰</div>
                  <p className="text-gray-500">Revenue</p>
                  <h2 className="text-4xl font-extrabold mt-2">
                    ₹{totalRevenue}
                  </h2>
                </div>

                <div className="bg-white rounded-3xl shadow p-6 border border-black/5">
                  <div className="text-3xl mb-4">⚠️</div>
                  <p className="text-gray-500">Low Stock</p>
                  <h2 className="text-4xl font-extrabold mt-2">
                    {lowStockProducts.length}
                  </h2>
                </div>
              </div>

              <AdminCharts orders={orders} />

              <div className="bg-white rounded-3xl shadow p-6 border border-black/5">
                <h2 className="text-2xl font-extrabold mb-6">
                  Recent Orders
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-gray-500">
                        <th className="py-4">Order ID</th>
                        <th>User</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order._id} className="border-b">
                          <td className="py-4 font-bold">
                            #{order._id.slice(-8)}
                          </td>
                          <td>{order.user?.name}</td>
                          <td>₹{order.totalAmount}</td>
                          <td>{order.paymentStatus}</td>
                          <td>{order.orderStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Products */}
          {activeTab === "products" && (
            <div className="bg-white rounded-3xl shadow p-6 border border-black/5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="py-4">Image</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b">
                        <td className="py-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-contain rounded-xl bg-[#faf7f2]"
                          />
                        </td>

                        <td className="font-bold">{product.name}</td>
                        <td>{product.brand}</td>
                        <td>₹{product.discountPrice || product.price}</td>
                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                              product.stock <= 5
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>

                        <td className="space-x-3">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="bg-[#c9a24d] px-4 py-2 rounded-xl text-black font-bold"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="bg-red-500 px-4 py-2 rounded-xl text-white font-bold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-3xl shadow p-6 border border-black/5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="py-4">Order ID</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b">
                        <td className="py-4 font-bold">
                          #{order._id.slice(-8)}
                        </td>
                        <td>{order.user?.name}</td>
                        <td>₹{order.totalAmount}</td>
                        <td>{order.paymentStatus}</td>
                        <td>
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            className="border p-2 rounded-xl font-bold"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
{/* Categories */}
{activeTab === "categories" && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    {/* Add Category */}
    <div className="bg-white rounded-3xl shadow p-6 border border-black/5 h-fit">
      <h2 className="text-2xl font-extrabold mb-6">
        Add Category
      </h2>

      <input
        type="text"
        placeholder="Category name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="w-full border p-4 rounded-2xl"
      />

      <button
        onClick={addCategory}
        className="w-full mt-5 bg-black text-white py-4 rounded-2xl font-bold hover:bg-[#c9a24d] hover:text-black transition"
      >
        Add Category
      </button>
    </div>

    {/* Category List */}
    <div className="lg:col-span-2 bg-white rounded-3xl shadow p-6 border border-black/5">
      <h2 className="text-2xl font-extrabold mb-6">
        All Categories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-[#faf7f2] rounded-2xl p-5 flex justify-between items-center"
          >
            <div>
              <h3 className="font-extrabold text-lg">
                {category.name}
              </h3>
            </div>

            <button
              onClick={async () => {
                try {
                  await API.delete(
                    `/categories/${category._id}`
                  );

                  toast.success("Category deleted");

                  fetchData();
                } catch (error) {
                  toast.error("Delete failed");
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

{/* Users */}
{activeTab === "users" && (
  <div className="bg-white rounded-3xl shadow p-6 border border-black/5">
    <h2 className="text-2xl font-extrabold mb-6">
      Registered Users
    </h2>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="py-4">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="py-4 font-bold">
                {user.name}
              </td>

              <td>{user.email}</td>

              <td>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    user.role === "admin"
                      ? "bg-black text-white"
                      : "bg-[#faf7f2]"
                  }`}
                >
                  {user.role}
                </span>
              </td>

              <td>
                {new Date(
                  user.createdAt
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
          {/* Low Stock */}
          {activeTab === "stock" && (
            <div className="bg-white rounded-3xl shadow p-6 border border-black/5">
              {lowStockProducts.length === 0 ? (
                <p className="text-gray-500 font-bold">
                  No low stock products.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product._id}
                      className="border rounded-3xl p-5 bg-[#faf7f2]"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-contain"
                      />

                      <h3 className="text-xl font-extrabold mt-4">
                        {product.name}
                      </h3>

                      <p className="text-gray-500">{product.brand}</p>

                      <p className="mt-3 text-red-600 font-extrabold">
                        Only {product.stock} left
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onProductAdded={fetchData}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onProductUpdated={fetchData}
        />
      )}
    </div>
  );
};

export default AdminDashboard;