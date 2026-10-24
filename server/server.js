import "./config/instrument.js"; // MUST be first

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import { clerkWebhook } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import {clerkMiddleware} from "@clerk/express";



const app = express();

await connectDB();
await connectCloudinary();

app.use(cors());

// Webhook route MUST be before express.json() to preserve raw body for Svix verification
app.post("/webhooks", express.json(), clerkWebhook);

app.use(express.json());
app.use("/api/users", clerkMiddleware(), userRoutes);

// ROUTES
app.get("/", (req, res) => {
  res.send("Api is running...");
});

app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
