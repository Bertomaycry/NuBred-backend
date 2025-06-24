import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes
app.use("/api/users", userRoutes);

export default app;
