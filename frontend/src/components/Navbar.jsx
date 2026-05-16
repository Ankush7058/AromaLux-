import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeMenu = () => setOpen(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#c9a24d] text-black text-center text-sm md:text-base font-semibold py-2">
        ✨ Free shipping on orders above ₹2999 | 100% authentic luxury perfumes
      </div>

      {/* Navbar */}
      <nav className="bg-black/95 backdrop-blur text-white sticky top-0 z-50 shadow-lg border-b border-yellow-600/20">
        <div className="flex justify-between items-center px-6 md:px-12 py-5">
          <Link to="/" className="flex flex-col leading-none">
            <span className="text-3xl font-extrabold tracking-wide">
              Aroma<span className="text-[#c9a24d]">Lux</span>
            </span>
            <span className="text-[11px] tracking-[0.35em] text-gray-400 mt-1">
              PERFUME HOUSE
            </span>
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-3xl border border-white/20 px-3 py-1 rounded-lg"
          >
            {open ? "×" : "☰"}
          </button>

          <div className="hidden md:flex gap-8 items-center text-sm font-semibold">
            <Link className="hover:text-[#c9a24d] transition" to="/">
              Home
            </Link>

            <Link className="hover:text-[#c9a24d] transition" to="/cart">
              Cart
            </Link>

            <Link className="hover:text-[#c9a24d] transition" to="/my-orders">
              My Orders
            </Link>

            <Link className="hover:text-[#c9a24d] transition" to="/wishlist">
              Wishlist
            </Link>

            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    className="hover:text-[#c9a24d] transition"
                    to="/admin"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="bg-white text-black px-5 py-2 rounded-full hover:bg-[#c9a24d] transition font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="hover:text-[#c9a24d] transition" to="/login">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-[#c9a24d] text-black px-5 py-2 rounded-full hover:bg-white transition font-bold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden flex flex-col gap-4 px-6 pb-6 bg-black border-t border-white/10 text-sm font-semibold">
            <Link onClick={closeMenu} to="/" className="hover:text-[#c9a24d]">
              Home
            </Link>

            <Link onClick={closeMenu} to="/cart" className="hover:text-[#c9a24d]">
              Cart
            </Link>

            <Link
              onClick={closeMenu}
              to="/my-orders"
              className="hover:text-[#c9a24d]"
            >
              My Orders
            </Link>

            <Link
              onClick={closeMenu}
              to="/wishlist"
              className="hover:text-[#c9a24d]"
            >
              Wishlist
            </Link>

            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    onClick={closeMenu}
                    to="/admin"
                    className="hover:text-[#c9a24d]"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="text-left text-red-300 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  onClick={closeMenu}
                  to="/login"
                  className="hover:text-[#c9a24d]"
                >
                  Login
                </Link>

                <Link
                  onClick={closeMenu}
                  to="/register"
                  className="bg-[#c9a24d] text-black px-4 py-2 rounded-full text-center font-bold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;