import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
<<<<<<< HEAD
import productRoutes from "./routes/productRoutes.js";
import shopRoutes from "./routes/ShopRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
=======
import productsRoutes from "./routes/productRoutes.js";
>>>>>>> 948c3c9 (Finalized updates for Order and Product controllers)

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/shops", shopRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

<<<<<<< HEAD
app.get("/", (req, res) => {
  res.send("🚀 Create Your Shop Backend is running successfully!");
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
=======
app.use("/api/orders", orderRoutes);
app.use("/api", productsRoutes);
>>>>>>> 948c3c9 (Finalized updates for Order and Product controllers)

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
