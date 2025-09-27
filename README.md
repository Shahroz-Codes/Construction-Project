# 🏗️ Construction Project Management Platform

A full-stack MERN application for managing construction material procurement, supplier bidding, inventory, and order workflows. This platform supports multiple user roles (Admin, Wholesaler, Retailer, Customer), real-time inventory, dynamic pricing, and communication between buyers and suppliers.

---

## 🚀 Project Overview

This project streamlines the construction supply chain by connecting customers, retailers, wholesalers, and suppliers on a single platform. It enables:

- **Role-based dashboards** for Admin, Wholesaler, Retailer, and Customer
- **Product & inventory management** with real-time stock tracking
- **Order placement** (retail & bulk), PDF invoice generation, and payment status updates
- **Supplier bidding system** for bulk orders
- **Supplier ratings & reviews**
- **Discounts, coupons, and dynamic pricing**
- **Live chat** and **notifications** (in progress)
- **Planned:** Logistics/delivery tracking, full payment gateway integration

---

## 🗂️ Project Structure

```
Construction-Project/
│
├── backend/      # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── controllers/    # Business logic for all modules
│   │   ├── middleware/     # Auth & role protection
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # RESTful API endpoints
│   │   ├── utils/          # Helpers (e.g., email, PDF)
│   │   └── server.js       # App entry point
│   ├── services/           # (Reserved for microservices or integrations)
│   └── .env                # Environment variables
│
├── frontend/    # React + Vite client
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── assets/         # Images, icons
│   │   ├── components/     # Navbar, Sidebar, Layout, ProtectedRoute
│   │   ├── context/        # Auth context
│   │   ├── layouts/        # App layout
│   │   └── pages/          # Role-based dashboards & feature pages
│   └── public/             # Static files
│
└── README.md    # Project documentation
```

---

## 🧑‍💻 Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, PDFKit, Nodemailer
- **Frontend:** React, Vite, Axios, Context API, CSS Modules
- **Other:** Role-based access, RESTful APIs, planned payment gateway & notifications

---

## ✨ Key Features 

### User Roles & Authentication -working
- JWT authentication
- Role-based access (Admin, Wholesaler, Retailer, Customer)
- Protected API routes

### Product & Inventory Management -working
- CRUD for materials (cement, bricks, steel, etc.)
- Real-time inventory tracking
- Bulk order discounts & low-stock alerts

### Order Management -debugging and frontend remains
- Place retail & bulk orders
- PDF invoice generation
- Payment status tracking (Paid/Pending/Failed)

### Supplier & Vendor System -debugging and frontend remains
- Multiple suppliers per material
- Supplier ratings & reviews
- Bulk order bidding system

### Pricing & Payments -debugging and frontend remains
- Dynamic pricing (wholesale/retail)
- Discount/coupon logic
- Payment method stubs (integration pending)

---

## 🚧 In Progress / Next Steps

- **Live chat** between customers and vendors
- **Push notifications & email alerts** (order updates, offers)
- **Logistics/delivery tracking**
- **Full payment gateway integration**
- **Frontend:** Connect all dashboards to backend APIs, implement chat/notifications UI

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- (Optional) Vercel/Render/AWS for deployment

### Backend Setup

```bash
cd backend
npm install
# Configure .env (see .env.sample)
cd src
npm node server.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📚 How to Continue Development

1. **Review the controllers and pages for business logic and UI.**
2. **Check routes and axios.js for API endpoints.**
3. **Continue chat and notification modules (see `chatController.js`, `notificationController.js`).**
4. **Integrate payment gateway and logistics as planned.**
5. **Connect frontend dashboards to backend APIs (see `ProtectedRoute.jsx`, `AuthContext.jsx`).**

---

- Follow existing code style and folder structure.
- Document new APIs and components.
- Update this README with major changes.

---
