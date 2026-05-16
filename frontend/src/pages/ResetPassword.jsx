import { useState } from "react";
import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.put(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      toast.success(res.data.message);

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Password reset failed"
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
          Secure Access
        </p>

        <h2 className="text-5xl font-extrabold text-center mt-4">
          Reset Password
        </h2>

        <p className="text-gray-500 text-center mt-5 leading-relaxed">
          Enter your new password to continue using your
          AromaLux account.
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-black/10 p-4 rounded-2xl mt-10 outline-none focus:border-[#c9a24d]"
          required
        />

        <button className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-extrabold hover:bg-[#c9a24d] hover:text-black transition">
          Reset Password
        </button>

        <p className="text-center mt-8 text-gray-600">
          Back to{" "}
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

export default ResetPassword;