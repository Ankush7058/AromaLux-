import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/forgot-password", {
        email,
      });

      toast.success(res.data.message);

      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to send reset email"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-10 rounded-[36px] shadow-2xl border border-black/5"
      >
        <p className="text-[#c9a24d] uppercase tracking-[0.3em] font-bold text-sm text-center">
          Password Recovery
        </p>

        <h2 className="text-5xl font-extrabold text-center mt-4">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-center mt-5 leading-relaxed">
          Enter your email address and we’ll send you a secure
          password reset link.
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-black/10 p-4 rounded-2xl mt-10 outline-none focus:border-[#c9a24d]"
          required
        />

        <button className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-extrabold hover:bg-[#c9a24d] hover:text-black transition">
          Send Reset Link
        </button>

        <p className="text-center mt-8 text-gray-600">
          Remember password?{" "}
          <Link
            to="/login"
            className="font-extrabold text-[#c9a24d]"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;