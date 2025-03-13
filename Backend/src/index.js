import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";

dotenv.config();
import authRoutes from "./routes/auth.route.js";

const PORT = process.env.PORT
const app = express();
connectDB();

app.use(express.json({
  limit:'50mb'
}));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.get("/", (req, res) => {
  res.send("<h1>Welcome Restful Service for MERN Chat Project</h1>");
});
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
