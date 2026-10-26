import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import testRoutes from "./modules/test/test.routes";
import { errorHandler, notFound } from "./middlewares/error.middleware";

const app = express();

// 1. Middlewares globaux
app.use(cors());
app.use(express.json());

// 2. Routes
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

// 3. Toujours en dernier : route inconnue, puis erreurs
app.use(notFound);
app.use(errorHandler);

export default app;