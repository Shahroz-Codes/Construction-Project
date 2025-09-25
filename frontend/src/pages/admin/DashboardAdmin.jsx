// src/pages/Admin/DashboardAdmin.jsx
import React from "react";
import Layout from "../../components/Layout";

const DashboardAdmin = () => {
  return (
    <Layout role="admin">
      <h1 className="text-2xl font-bold mb-4">Welcome, Admin</h1>
      <p>Use the sidebar to manage users, products, and orders.</p>
    </Layout>
  );
};

export default DashboardAdmin;
