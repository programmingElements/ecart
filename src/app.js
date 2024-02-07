import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/users.routes.js";
import productRoutes from "./routes/products.routes.js";
import { CORS_ORIGIN } from "./config/index.js";
import {errorHandler} from "./middlewares/error.middlewares.js";

const app = express();

// config cross origin resource sharing (cors)
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// config routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// config error
app.use(errorHandler);

export { app };