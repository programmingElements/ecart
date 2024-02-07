import express from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js";
import { createProduct } from "../controllers/products.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.route("/").post(verifyJWT, upload.single("imageUrl"), createProduct);

export default router;