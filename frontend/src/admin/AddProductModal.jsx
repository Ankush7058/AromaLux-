import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";

const AddProductModal = ({ onClose, onProductAdded }) => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    gender: "Men",
    price: "",
    discountPrice: "",
    stock: "",
    size: "",
    description: "",
    isFeatured: false,
  });

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();

      Object.keys(form).forEach((key) => {
        productData.append(key, form[key]);
      });

      for (let i = 0; i < images.length; i++) {
        productData.append("images", images[i]);
      }

      await API.post("/products", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully");
      onProductAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Product add failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <button type="button" onClick={onClose} className="text-2xl">
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Product Name" onChange={handleChange} className="border p-3 rounded" required />
          <input name="brand" placeholder="Brand" onChange={handleChange} className="border p-3 rounded" required />

          <select name="category" value={form.category} onChange={handleChange} className="border p-3 rounded" required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select name="gender" value={form.gender} onChange={handleChange} className="border p-3 rounded" required>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>

          <input name="price" type="number" placeholder="Price" onChange={handleChange} className="border p-3 rounded" required />
          <input name="discountPrice" type="number" placeholder="Discount Price" onChange={handleChange} className="border p-3 rounded" />

          <input name="stock" type="number" placeholder="Stock" onChange={handleChange} className="border p-3 rounded" required />
          <input name="size" placeholder="Size e.g. 100ml" onChange={handleChange} className="border p-3 rounded" required />

          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="border p-3 rounded md:col-span-2"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="border p-3 rounded md:col-span-2"
            rows="4"
            required
          />

          <label className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />
            Featured Product
          </label>
        </div>

        <button className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductModal;