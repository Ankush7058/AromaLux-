import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);

  const addToCart = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add product to cart");
      navigate("/login");
      return;
    }

    try {
      await API.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to use wishlist");
      navigate("/login");
      return;
    }

    try {
      const res = await API.post("/wishlist/toggle", {
        productId: product._id,
      });

      toast.success(res.data.message);
      setWishlisted((prev) => !prev);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };

  const fetchWishlistStatus = async () => {
    try {
      const res = await API.get("/wishlist");

      const exists = res.data.products?.some(
        (item) => item._id === product._id
      );

      setWishlisted(exists);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchWishlistStatus();
    }
  }, []);

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group relative bg-white rounded-[32px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-black/5"
    >
      {product.discountPrice && (
        <div className="absolute top-5 left-5 z-20 bg-[#c9a24d] text-black px-4 py-2 rounded-full text-sm font-extrabold shadow-lg">
          {discountPercentage}% OFF
        </div>
      )}

      <button
        onClick={toggleWishlist}
        className={`absolute top-5 right-5 z-20 w-12 h-12 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center text-xl transition ${
          wishlisted
            ? "bg-red-500 text-white"
            : "bg-white/80 text-gray-700 hover:text-red-500"
        }`}
      >
        ♥
      </button>

      <div className="relative overflow-hidden bg-[#f8f5ef]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[360px] object-contain group-hover:scale-110 transition duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product._id}`);
          }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#c9a24d]"
        >
          Quick View
        </button>
      </div>

      <div className="p-6">
        <p className="text-[#c9a24d] uppercase tracking-[0.25em] text-xs font-bold">
          {product.brand}
        </p>

        <h3 className="text-2xl font-extrabold mt-3 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>{product.size}</span>
          <span>{product.gender}</span>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="text-[#c9a24d] text-sm">★★★★★</div>
          <span className="text-sm text-gray-500">Premium Choice</span>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <span className="text-3xl font-extrabold">
            ₹{product.discountPrice || product.price}
          </span>

          {product.discountPrice && (
            <span className="text-lg line-through text-gray-400">
              ₹{product.price}
            </span>
          )}
        </div>

        <div className="mt-3">
          {product.stock > 0 ? (
            <span className="text-green-600 text-sm font-bold">In Stock</span>
          ) : (
            <span className="text-red-500 text-sm font-bold">Out of Stock</span>
          )}
        </div>

        <button
          onClick={addToCart}
          disabled={product.stock <= 0}
          className={`w-full mt-6 py-4 rounded-2xl font-extrabold transition-all duration-300 ${
            product.stock > 0
              ? "bg-black text-white hover:bg-[#c9a24d] hover:text-black"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {product.stock > 0 ? "Add To Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;