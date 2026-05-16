import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import API from "../services/api";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);

      setProduct(res.data);

      if (res.data.images?.length > 0) {
        setSelectedImage(res.data.images[0]);
      } else {
        setSelectedImage(res.data.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);

      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const res = await API.get(`/products/related/${id}`);
      setRelatedProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async () => {
    try {
      await API.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Please login first");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await API.post("/reviews", {
        productId: product._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });

      toast.success("Review submitted");

      setReviewForm({
        rating: 5,
        comment: "",
      });

      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed");
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchRelatedProducts();
  }, [id]);

  if (!product) {
    return <LoadingSpinner text="Loading perfume..." />;
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      <Navbar />

      <div className="px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-black/5">
          
          {/* LEFT */}
          <div>
            <div className="bg-[#f5f0e7] rounded-[30px] overflow-hidden">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[650px] object-contain"
              />
            </div>

            {product.images?.length > 0 && (
              <div className="flex gap-4 mt-6 overflow-x-auto">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="thumbnail"
                    onClick={() => setSelectedImage(img)}
                    className={`w-24 h-24 object-cover rounded-2xl cursor-pointer border-2 transition ${
                      selectedImage === img
                        ? "border-[#c9a24d]"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex flex-col justify-center">
            <p className="text-[#c9a24d] uppercase tracking-[0.3em] font-bold text-sm">
              {product.brand}
            </p>

            <h1 className="text-5xl md:text-6xl font-extrabold mt-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-6">
              <span className="text-yellow-500 text-2xl">★★★★★</span>

              <span className="text-xl font-bold">
                {averageRating || "0"}
              </span>

              <span className="text-gray-500">
                ({reviews.length} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <span className="text-5xl font-extrabold">
                ₹{product.discountPrice || product.price}
              </span>

              {product.discountPrice && (
                <span className="text-2xl line-through text-gray-400">
                  ₹{product.price}
                </span>
              )}
            </div>

            <p className="mt-8 text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <div className="bg-[#faf7f2] rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Gender</p>
                <h3 className="font-bold text-lg mt-1">
                  {product.gender}
                </h3>
              </div>

              <div className="bg-[#faf7f2] rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Size</p>
                <h3 className="font-bold text-lg mt-1">
                  {product.size}
                </h3>
              </div>

              <div className="bg-[#faf7f2] rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Stock</p>
                <h3 className="font-bold text-lg mt-1">
                  {product.stock > 0 ? "Available" : "Out of Stock"}
                </h3>
              </div>

              <div className="bg-[#faf7f2] rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Authenticity</p>
                <h3 className="font-bold text-lg mt-1">
                  100% Original
                </h3>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={addToCart}
                className="flex-1 bg-black text-white py-5 rounded-2xl text-lg font-extrabold hover:bg-[#c9a24d] hover:text-black transition"
              >
                Add To Cart
              </button>

              <button className="flex-1 border-2 border-black py-5 rounded-2xl text-lg font-extrabold hover:bg-black hover:text-white transition">
                Buy Now
              </button>
            </div>

            <div className="mt-10 border-t pt-8">
              <div className="flex items-center gap-4 text-gray-700">
                <span>🚚 Fast Delivery</span>
                <span>🔒 Secure Payment</span>
                <span>✨ Premium Packaging</span>
              </div>
            </div>
          </div>
        </div>

      {/* Reviews */}
<div className="mt-20 bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-black/5">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
    <div>
      <p className="text-[#c9a24d] uppercase tracking-[0.3em] font-bold text-sm">
        Reviews
      </p>

      <h2 className="text-4xl font-extrabold mt-3">
        Customer Reviews
      </h2>

      <p className="text-gray-500 mt-2">
        Share your fragrance experience with other customers.
      </p>
    </div>

    <div className="mt-6 md:mt-0 bg-[#faf7f2] rounded-3xl px-8 py-5 text-center">
      <div className="text-[#c9a24d] text-3xl font-bold">
        ★ {averageRating || "0"}
      </div>
      <p className="text-gray-500 text-sm">
        Based on {reviews.length} reviews
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    {/* Review Form */}
    <form
      onSubmit={submitReview}
      className="bg-[#faf7f2] rounded-3xl p-7 border border-black/5"
    >
      <h3 className="text-2xl font-extrabold mb-5">
        Write a Review
      </h3>

      <p className="font-semibold mb-3">Your Rating</p>

      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() =>
              setReviewForm({
                ...reviewForm,
                rating: star,
              })
            }
            className={`text-4xl transition ${
              star <= reviewForm.rating
                ? "text-[#c9a24d]"
                : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        placeholder="Write your review..."
        value={reviewForm.comment}
        onChange={(e) =>
          setReviewForm({
            ...reviewForm,
            comment: e.target.value,
          })
        }
        className="w-full border p-4 rounded-2xl mb-5 outline-none focus:border-[#c9a24d]"
        rows="6"
        required
      />

      <button className="w-full bg-black text-white py-4 rounded-2xl font-extrabold hover:bg-[#c9a24d] hover:text-black transition">
        Submit Review
      </button>
    </form>

    {/* Review List */}
    <div className="bg-[#faf7f2] rounded-3xl p-7 border border-black/5">
      <h3 className="text-2xl font-extrabold mb-6">
        Recent Feedback
      </h3>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">⭐</div>
          <p className="font-bold text-lg">No reviews yet</p>
          <p className="text-gray-500 mt-2">
            Be the first to review this perfume.
          </p>
        </div>
      ) : (
        <div className="space-y-5 max-h-[520px] overflow-y-auto pr-2">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <h4 className="font-extrabold">
                      {review.user?.name || "User"}
                    </h4>

                    <p className="text-xs text-gray-400">
                      Verified Buyer
                    </p>
                  </div>
                </div>

                <div className="text-[#c9a24d] font-bold whitespace-nowrap">
                  {"★".repeat(review.rating)}
                  <span className="text-gray-300">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mt-5 leading-relaxed">
                {review.comment}
              </p>

              <p className="text-xs text-gray-400 mt-4">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="mb-10">
              <p className="text-[#c9a24d] uppercase tracking-[0.3em] font-bold text-sm">
                Recommendations
              </p>

              <h2 className="text-4xl font-extrabold mt-3">
                Related Products
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;