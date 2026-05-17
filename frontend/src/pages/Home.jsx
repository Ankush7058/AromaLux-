import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import HeroCarousel from "../components/HeroCarousel";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    gender: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async (currentFilters = filters) => {
    try {
      setLoading(true);

      const query = new URLSearchParams();

      Object.keys(currentFilters).forEach((key) => {
        if (currentFilters[key]) {
          query.append(key, currentFilters[key]);
        }
      });

      const res = await API.get(`/products?${query.toString()}`);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const updatedFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };

    setFilters(updatedFilters);

    if (e.target.name === "sort") {
      fetchProducts(updatedFilters);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    const resetFilters = {
      search: "",
      category: "",
      gender: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    };

    setFilters(resetFilters);
    fetchProducts(resetFilters);
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      <Navbar />

      <HeroCarousel
        search={filters.search}
        onSearchChange={handleChange}
        onSearchSubmit={handleSearch}
      />

      {/* Categories */}
      <section className="px-6 md:px-12 py-16">
        <div className="text-center mb-12">
          <p className="text-[#c9a24d] font-bold tracking-[0.3em] uppercase text-sm">
            Categories
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-4">
            Shop By Collection
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Men",
              image:
                "https://nourishmantra.in/cdn/shop/articles/7xm.xyz359869.jpg?v=1735233847&width=1100",
            },
            {
              title: "Women",
              image:
                "https://cdn.shopify.com/s/files/1/0250/8482/1600/files/lily_bcb68453-caa7-42ef-837e-9f48d074996a.jpg?v=1745505644",
            },
            {
              title: "Luxury",
              image:
                "https://irfe.com/wp-content/uploads/2025/08/a-few-long-lasting-luxury-perfume-bottles-advertisement-professional-photoshoot.jpg",
            },
            {
              title: "Unisex",
              image:
                "https://www.shutterstock.com/image-photo/man-women-using-perfume-600nw-2575890935.jpg",
            },
          ].map((cat, index) => (
            <div
              key={index}
              className="relative rounded-3xl overflow-hidden h-72 group cursor-pointer shadow-xl"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition"></div>

              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-3xl font-extrabold">
                  {cat.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products + Sidebar Filters */}
      <section className="px-6 md:px-12 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <div className="lg:w-[320px]">
            <div className="bg-white rounded-[32px] shadow-xl border border-black/5 p-6 sticky top-28">
              <h2 className="text-2xl font-extrabold mb-8">
                Filters
              </h2>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="font-bold block mb-3">
                    Category
                  </label>

                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="w-full border p-4 rounded-2xl"
                  >
                    <option value="">All Categories</option>

                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="font-bold block mb-3">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleChange}
                    className="w-full border p-4 rounded-2xl"
                  >
                    <option value="">All Gender</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="font-bold block mb-3">
                    Min Price
                  </label>

                  <input
                    type="number"
                    name="minPrice"
                    placeholder="₹500"
                    value={filters.minPrice}
                    onChange={handleChange}
                    className="w-full border p-4 rounded-2xl"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="font-bold block mb-3">
                    Max Price
                  </label>

                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="₹10000"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    className="w-full border p-4 rounded-2xl"
                  />
                </div>

                {/* Sort */}
                <div>
                  <label className="font-bold block mb-3">
                    Sort By
                  </label>

                  <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleChange}
                    className="w-full border p-4 rounded-2xl"
                  >
                    <option value="">Select</option>
                    <option value="price-low-high">
                      Price: Low to High
                    </option>

                    <option value="price-high-low">
                      Price: High to Low
                    </option>

                    <option value="newest">
                      Newest
                    </option>

                    <option value="oldest">
                      Oldest
                    </option>
                  </select>
                </div>

                <button
                  onClick={() => fetchProducts()}
                  className="w-full bg-black text-white py-4 rounded-2xl font-extrabold hover:bg-[#c9a24d] hover:text-black transition"
                >
                  Apply Filters
                </button>

                <button
                  onClick={clearFilters}
                  className="w-full border py-4 rounded-2xl font-bold hover:bg-[#faf7f2] transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
              <div>
                <p className="text-[#c9a24d] font-bold uppercase tracking-widest text-sm">
                  Discover
                </p>

                <h2 className="text-4xl font-extrabold mt-3">
                  Featured Perfumes
                </h2>
              </div>

              <div className="mt-4 md:mt-0 bg-white px-6 py-4 rounded-2xl shadow border border-black/5">
                <p className="font-bold text-gray-600">
                  {products.length} Products Found
                </p>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading perfumes..." />
            ) : products.length === 0 ? (
              <EmptyState
                title="No perfumes found"
                message="Try changing your search or filter options."
                buttonText="Clear Filters"
                onClick={clearFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    {/* Luxury Banner */}
<section className="px-4 sm:px-6 md:px-12 py-8 md:py-12">
  <div className="rounded-[28px] md:rounded-[40px] overflow-hidden relative min-h-[430px] md:min-h-[500px]">
    <img
      src="https://www.isakfragrances.com/cdn/shop/articles/Gemini_Generated_Image_evzjo4evzjo4evzj.png?v=1776150776&width=2730"
      alt="Luxury"
      className="absolute inset-0 w-full h-full object-cover"
    />

    <div className="absolute inset-0 bg-black/60 flex items-center">
      <div className="px-6 sm:px-8 md:px-20 max-w-2xl text-white">
        <p className="text-[#c9a24d] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-base">
          Luxury Collection
        </p>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mt-4 md:mt-5">
          Crafted For Elegance & Presence
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-gray-200 mt-5 md:mt-6 leading-relaxed max-w-md">
          Experience premium fragrances designed to leave a lasting impression
          wherever you go.
        </p>

        <button className="mt-7 md:mt-8 bg-[#c9a24d] text-black px-7 md:px-8 py-3 md:py-4 rounded-full font-extrabold hover:bg-white transition">
          Explore Collection
        </button>
      </div>
    </div>
  </div>
</section>
      {/* Why Choose Us */}
      <section className="px-6 md:px-12 py-20">
        <div className="text-center mb-14">
          <p className="text-[#c9a24d] font-bold uppercase tracking-[0.3em] text-sm">
            Why Us
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-4">
            Why Choose AromaLux
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "100% Authentic",
              desc: "Only genuine premium perfumes from trusted brands.",
            },
            {
              title: "Fast Delivery",
              desc: "Quick and secure shipping across India.",
            },
            {
              title: "Secure Payments",
              desc: "Safe checkout with trusted payment methods.",
            },
            {
              title: "Premium Packaging",
              desc: "Luxury packaging experience for every order.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg border border-black/5 hover:-translate-y-2 transition"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#c9a24d]/15 flex items-center justify-center text-3xl mb-6">
                ✨
              </div>

              <h3 className="text-2xl font-extrabold mb-4">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-12 py-20 bg-black text-white">
        <div className="text-center mb-14">
          <p className="text-[#c9a24d] font-bold uppercase tracking-[0.3em] text-sm">
            Testimonials
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-4">
            What Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            "Absolutely premium experience. The fragrance quality is amazing.",
            "Packaging and delivery were perfect. Highly recommended.",
            "AromaLux feels like a real luxury perfume brand website.",
          ].map((review, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 backdrop-blur rounded-3xl p-8"
            >
              <div className="text-[#c9a24d] text-3xl mb-5">★★★★★</div>

              <p className="text-gray-300 leading-relaxed">
                {review}
              </p>

              <div className="mt-6">
                <h4 className="font-bold">Luxury Customer</h4>
                <p className="text-sm text-gray-400">Verified Buyer</p>
              </div>
            </div>
          ))}
        </div>
      </section>

   {/* Brand Marquee */}
<section className="bg-[#111] mt-10 py-12 overflow-hidden">
  
  {/* Title */}
  <div className="text-center mb-10">
    <p className="text-[#c9a24d] font-bold uppercase tracking-[0.3em] text-sm">
      Brands
    </p>

    <h2 className="text-white text-4xl md:text-5xl font-extrabold mt-4">
      Luxury Partners
    </h2>
  </div>

  {/* Marquee Logos */}
  <div className="overflow-hidden">
    <div className="flex items-center gap-20 whitespace-nowrap animate-[marquee_25s_linear_infinite]">

      {[
        {
          name: "Dior",
          logo: "https://vesaura.com/cdn/shop/articles/Dior_Logo.png?v=1754924218",
        },
        {
          name: "Chanel",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKnbLhq2il7rDtr_qhGtcMmvwYCOri_0Yb0w&s",
        },
        {
          name: "Gucci",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9bFFvcIz0WhJPg8Vpic3Aof1iWGWZaM0TOQ&s",
        },
        {
          name: "Versace",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5NSYO4KeMVZE7Sp54nSWN1Ew4695dGLFDIQ&s",
        },
        {
          name: "Armani",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlGvz5s-tI00HWjgUMLU41uuFXIh8T51QN6Q&s",
        },
        {
          name: "YSL",
          logo: "https://cdn.shopify.com/s/files/1/0698/2978/7925/files/logo_e4127dec-b455-4c26-a992-fe3ff442af89.jpg?v=1729458190",
        },
        {
          name: "Prada",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSffyEkkWLCtO3YJNVNoF81toR7kIToaNydw&s",
        },
        {
          name: "Tom Ford",
          logo: "https://i.pinimg.com/736x/f8/48/90/f848909574ad6fd94d891614176d93b4.jpg",
        },
        {
          name: "Creed",
          logo: "https://pbs.twimg.com/profile_images/659748056607232000/zbXzU2ej_400x400.jpg",
        },
       
      ].map((brand, index) => (
        <div
          key={index}
          className="flex items-center justify-center min-w-[180px] h-[100px] bg-white/5 border border-white/10 rounded-3xl px-8 hover:bg-white/10 transition"
        >
          <img
            src={brand.logo}
            alt={brand.name}
            className="max-h-[50px] w-auto object-contain grayscale hover:grayscale-0 transition duration-300"
          />
        </div>
      ))}

    </div>
  </div>
</section>

      {/* Newsletter */}
      <section className="px-6 md:px-12 py-20">
        <div className="bg-gradient-to-r from-black to-[#2b2416] rounded-[40px] p-10 md:p-16 text-center text-white">
          <p className="text-[#c9a24d] font-bold uppercase tracking-[0.3em] text-sm">
            Newsletter
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-5">
            Get Exclusive Luxury Deals
          </h2>

          <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
            Subscribe to receive new arrivals, luxury collections, and premium
            fragrance offers.
          </p>

         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto mt-10">
  <input
    type="email"
    placeholder="Enter your email"
    className="w-full sm:flex-1 bg-white text-black placeholder-gray-500 px-6 py-5 rounded-2xl outline-none border-none"
  />

  <button className="w-full sm:w-auto bg-[#c9a24d] text-black px-10 py-5 rounded-2xl font-extrabold hover:bg-white transition">
    Subscribe
  </button>
</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-3xl font-extrabold">
              Aroma<span className="text-[#c9a24d]">Lux</span>
            </h2>

            <p className="text-gray-400 mt-5 leading-relaxed">
              Luxury fragrance destination for premium perfumes and timeless
              scents.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">Quick Links</h3>

            <div className="flex flex-col gap-3 text-gray-400">
              <p>Home</p>
              <p>Wishlist</p>
              <p>Cart</p>
              <p>My Orders</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">Customer Care</h3>

            <div className="flex flex-col gap-3 text-gray-400">
              <p>Help Center</p>
              <p>Shipping</p>
              <p>Returns</p>
              <p>Privacy Policy</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">Contact</h3>

            <div className="flex flex-col gap-3 text-gray-400">
              <p>Mumbai, India</p>
              <p>support@aromalux.com</p>
              <p>+91 9876543210</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-gray-500 text-sm">
          © 2026 AromaLux. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;