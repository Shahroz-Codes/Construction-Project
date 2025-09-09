import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config({ path: "../.env" });
connectDB();      // connect using process.env.MONGO_URI
console.log("MONGO_URI from env:", process.env.MONGO_URI);

const app = express();
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Server running ✅" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
