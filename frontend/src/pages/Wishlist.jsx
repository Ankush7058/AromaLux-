import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import API from "../services/api";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await API.get("/wishlist");
      setWishlist(res.data.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Navbar />

      <div className="px-10 py-10">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {loading ? (
          <LoadingSpinner text="Loading wishlist..." />
        ) : wishlist.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            message="Save your favourite perfumes here."
            buttonText="Explore Products"
            onClick={() => (window.location.href = "/")}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;