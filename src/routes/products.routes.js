import express from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js";
import { createProduct, updateProduct } from "../controllers/products.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {adminUser} from "../middlewares/admin.middlewares.js";

const router = express.Router();

router.route("/").post([verifyJWT, adminUser], upload.single("imageUrl"), createProduct);

router.route("/:productId").put([verifyJWT, adminUser], upload.single("imageUrl"), updateProduct);

export default router;