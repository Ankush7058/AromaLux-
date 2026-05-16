import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: product.name || "",
    brand: product.brand || "",
    category: product.category?._id || product.category || "",
    gender: product.gender || "Men",
    price: product.price || "",
    discountPrice: product.discountPrice || "",
    stock: product.stock || "",
    size: product.size || "",
    description: product.description || "",
    isFeatured: product.isFeatured || false,
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

      await API.put(`/products/${product._id}`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully");
      onProductUpdated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Product update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Product</h2>
          <button type="button" onClick={onClose} className="text-2xl">
            ×
          </button>
        </div>

        {product.images?.length > 0 && (
          <div className="flex gap-3 mb-5 overflow-x-auto">
            {product.images.map((img, index) => (
              <img
                key={index}
               src={img}
                alt="product"
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} className="border p-3 rounded" required />
          <input name="brand" value={form.brand} onChange={handleChange} className="border p-3 rounded" required />

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

          <input name="price" type="number" value={form.price} onChange={handleChange} className="border p-3 rounded" required />
          <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} className="border p-3 rounded" />

          <input name="stock" type="number" value={form.stock} onChange={handleChange} className="border p-3 rounded" required />
          <input name="size" value={form.size} onChange={handleChange} className="border p-3 rounded" required />

          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="border p-3 rounded md:col-span-2"
          />

          <textarea
            name="description"
            value={form.description}
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
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductModal;