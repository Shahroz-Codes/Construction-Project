import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout
import AppLayout from "./layouts/AppLayout";

// Public
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

// Wholesaler
import DashboardWholesaler from "./pages/wholesaler/DashboardWholesaler";
import WholesalerInventory from "./pages/wholesaler/WholesalerInventory";
import WholesalerOrders from "./pages/wholesaler/WholesalerOrders";

// Retailer
import DashboardRetailer from "./pages/retailer/DashboardRetailer";
import RetailerOrders from "./pages/retailer/RetailerOrders";

// Customer
import DashboardCustomer from "./pages/customer/DashboardCustomer";
import CustomerOrders from "./pages/customer/CustomerOrders";
import CustomerCart from "./pages/customer/CustomerCart";

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Wrap all routes inside AppLayout */}
      <Route path="/" element={<AppLayout />}>
        {/* Root redirect */}
        <Route
          index
          element={
            user ? (
              <Navigate to={`/${user.role}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <DashboardAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/products"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminProducts />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/orders"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminUsers />
            </PrivateRoute>
          }
        />

        {/* Wholesaler Routes */}
        <Route
          path="wholesaler"
          element={
            <PrivateRoute roles={["wholesaler"]}>
              <DashboardWholesaler />
            </PrivateRoute>
          }
        />
        <Route
          path="wholesaler/inventory"
          element={
            <PrivateRoute roles={["wholesaler"]}>
              <WholesalerInventory />
            </PrivateRoute>
          }
        />
        <Route
          path="wholesaler/orders"
          element={
            <PrivateRoute roles={["wholesaler"]}>
              <WholesalerOrders />
            </PrivateRoute>
          }
        />

        {/* Retailer Routes */}
        <Route
          path="retailer"
          element={
            <PrivateRoute roles={["retailer"]}>
              <DashboardRetailer />
            </PrivateRoute>
          }
        />
        <Route
          path="retailer/orders"
          element={
            <PrivateRoute roles={["retailer"]}>
              <RetailerOrders />
            </PrivateRoute>
          }
        />

        {/* Customer Routes */}
        <Route
          path="customer"
          element={
            <PrivateRoute roles={["customer"]}>
              <DashboardCustomer />
            </PrivateRoute>
          }
        />
        <Route
          path="customer/orders"
          element={
            <PrivateRoute roles={["customer"]}>
              <CustomerOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="customer/cart"
          element={
            <PrivateRoute roles={["customer"]}>
              <CustomerCart />
            </PrivateRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
