import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Registration successful");

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black">
      {/* Left */}
      <div
        className="hidden lg:flex relative items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://mybombae.in/cdn/shop/files/3_54.webp?v=1758803298&width=1445')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-xl px-10 text-white">
          <p className="uppercase tracking-[0.4em] text-[#c9a24d] font-bold text-sm">
            AromaLux
          </p>

          <h1 className="text-6xl font-extrabold leading-tight mt-6">
            Create Your Luxury Fragrance Account
          </h1>

          <p className="text-lg text-gray-300 mt-6 leading-relaxed">
            Join AromaLux and explore premium perfumes,
            exclusive collections, and elegant experiences.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center justify-center px-6 py-12 bg-[#f8f5ef]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[36px] shadow-2xl border border-white/30"
        >
          <p className="text-[#c9a24d] uppercase tracking-[0.3em] font-bold text-sm text-center">
            AromaLux
          </p>

          <h2 className="text-5xl font-extrabold text-center mt-4">
            Register
          </h2>

          <p className="text-center text-gray-500 mt-4">
            Create your premium fragrance account.
          </p>

          <div className="mt-10 space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-black/10 p-4 rounded-2xl outline-none focus:border-[#c9a24d]"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-black/10 p-4 rounded-2xl outline-none focus:border-[#c9a24d]"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-black/10 p-4 rounded-2xl outline-none focus:border-[#c9a24d]"
              required
            />
          </div>

          <button className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-extrabold hover:bg-[#c9a24d] hover:text-black transition">
            Create Account
          </button>

          <p className="text-center mt-8 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-extrabold text-[#c9a24d]"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;