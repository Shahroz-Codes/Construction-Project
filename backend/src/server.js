import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http"; // for socket.io server
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import bulkOrderRoutes from "./routes/bulkOrderRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"; // 👈 new
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// HTTP + Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // later restrict to frontend URL
    methods: ["GET", "POST"]
  }
});

// Inject io into all requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/bulkorders", bulkOrderRoutes);
app.use("/api/chat", chatRoutes); // 👈 new
app.use("/api/notifications", notificationRoutes);

// Socket.io events
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // join personal room for private messaging
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`✅ User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
