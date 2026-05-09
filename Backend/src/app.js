import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/projects.route.js";
import taskRoutes from "./routes/task.route.js";
import userRoutes from "./routes/user.route.js";
import path from "path";

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://teamtaskmanager-production-5a91.up.railway.app:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
  });
});
app.get("/{*any}", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

export default app;
