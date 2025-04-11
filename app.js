import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import compression from "compression";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/home",userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
