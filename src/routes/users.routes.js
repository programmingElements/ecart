import express from "express";
import { registerUser } from "../controllers/users.controllers.js";
import { signUpValidation } from "../validators/users.validators.js";
import { validate } from "../middlewares/validate.middlewares.js";

const router = express.Router();

router.route("/register").post(validate(signUpValidation), registerUser);

export default router;