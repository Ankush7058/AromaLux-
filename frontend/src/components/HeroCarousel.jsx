import { useEffect, useState } from "react";
import API from "../services/api";

const slides = [
  {
    title: "Luxury Perfumes for Every Moment",
    subtitle:
      "Discover premium fragrances for men, women, and unisex collections.",
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyZnVtZXN8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Signature Scents, Timeless Style",
    subtitle:
      "Explore oud, floral, woody, citrus, and fresh perfume collections.",
    image:
      "https://cdn.mos.cms.futurecdn.net/VzUqgr8pfbNcfXrpzeVBPE-1920-80.jpg",
  },
  {
    title: "Premium Fragrances Delivered",
    subtitle:
      "Shop elegant perfumes with secure checkout and fast order flow.",
    image:
      "https://t3.ftcdn.net/jpg/16/19/76/90/360_F_1619769032_o8B8FBHq2r3oiZiLWh6kyAkGt7KLIArh.jpg",
  },
];

const HeroCarousel = ({ search, onSearchChange, onSearchSubmit }) => {
  const [active, setActive] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await API.get(`/products?search=${search}`);
        setSuggestions(res.data.slice(0, 5));
        setShowSuggestions(true);
      } catch (error) {
        console.log(error);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <section className="relative min-h-[700px] flex items-center overflow-visible z-50">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${slides[active].image})`,
        }}
      />

      <div className="absolute inset-0 bg-black/65"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20"></div>

      {/* Content */}
      <div className="relative z-[100] px-6 md:px-12 w-full">
        <div className="max-w-4xl">
          <p className="uppercase tracking-[0.4em] text-[#c9a24d] font-bold text-sm">
            AromaLux Collection
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mt-6 leading-tight">
            {slides[active].title}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl leading-relaxed">
            {slides[active].subtitle}
          </p>

          {/* Search */}
          <div className="relative mt-10 max-w-2xl z-[9999]">
            <form
              onSubmit={(e) => {
                setShowSuggestions(false);
                onSearchSubmit(e);
              }}
              className="flex bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <input
                type="text"
                name="search"
                placeholder="Search perfumes, brands, collections..."
                value={search}
                onChange={(e) => {
                  onSearchChange(e);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                className="w-full px-6 py-5 text-black outline-none text-lg"
              />

              <button className="bg-[#c9a24d] text-black px-10 font-extrabold hover:bg-[#ddb96b] transition">
                Search
              </button>
            </form>

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-3xl shadow-2xl mt-3 overflow-hidden z-[9999] border border-black/10">
                {suggestions.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      setShowSuggestions(false);
                      window.location.href = `/product/${item._id}`;
                    }}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#faf7f2] transition border-b last:border-b-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-contain rounded-xl bg-[#faf7f2]"
                    />

                    <div className="text-left">
                      <h3 className="font-bold text-black">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-5 mt-10">
            <button className="bg-[#c9a24d] text-black px-8 py-4 rounded-2xl font-extrabold hover:bg-[#ddb96b] transition">
              Explore Collection
            </button>

            <button className="border border-white text-white px-8 py-4 rounded-2xl font-extrabold hover:bg-white hover:text-black transition">
              Luxury Brands
            </button>
          </div>

          {/* Indicators */}
          <div className="flex gap-3 mt-14">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`h-3 rounded-full transition-all ${
                  active === index
                    ? "w-12 bg-[#c9a24d]"
                    : "w-3 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;