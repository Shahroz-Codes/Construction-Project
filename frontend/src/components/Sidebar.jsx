// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const menuItems = {
  admin: [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
  ],
  wholesaler: [
    { name: "Dashboard", path: "/wholesaler" },
    { name: "Inventory", path: "/wholesaler/inventory" },
    { name: "Orders", path: "/wholesaler/orders" },
  ],
  retailer: [
    { name: "Dashboard", path: "/retailer" },
    { name: "Products", path: "/retailer/products" },
    { name: "Orders", path: "/retailer/orders" },
  ],
  customer: [
    { name: "Dashboard", path: "/customer" },
    { name: "Shop", path: "/customer/shop" },
    { name: "Cart", path: "/customer/cart" },
    { name: "Orders", path: "/customer/orders" },
  ],
};

const Sidebar = ({ role }) => (
  <aside className="w-64 bg-gray-100 h-screen p-4 border-r">
    <ul className="space-y-2">
      {menuItems[role]?.map((item) => (
        <li key={item.name}>
          <Link 
            to={item.path} 
            className="block px-3 py-2 rounded hover:bg-gray-200"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;
