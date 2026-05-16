import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./admin/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route
          path="/"
          element={
            <AnimatedPage>
              <Home />
            </AnimatedPage>
          }
        />

        <Route
          path="/login"
          element={
            <AnimatedPage>
              <Login />
            </AnimatedPage>
          }
        />

        <Route
          path="/register"
          element={
            <AnimatedPage>
              <Register />
            </AnimatedPage>
          }
        />

        <Route
          path="/product/:id"
          element={
            <AnimatedPage>
              <ProductDetails />
            </AnimatedPage>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <AnimatedPage>
              <ForgotPassword />
            </AnimatedPage>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <AnimatedPage>
              <ResetPassword />
            </AnimatedPage>
          }
        />

        {/* Protected */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <Cart />
              </AnimatedPage>
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <Wishlist />
              </AnimatedPage>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <Checkout />
              </AnimatedPage>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <MyOrders />
              </AnimatedPage>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AnimatedPage>
                <AdminDashboard />
              </AnimatedPage>
            </AdminRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;