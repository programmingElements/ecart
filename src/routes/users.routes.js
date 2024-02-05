import express from "express";
import { loginUser, registerUser } from "../controllers/users.controllers.js";
import { signInValidation, signUpValidation } from "../validators/users.validators.js";
import { validate } from "../middlewares/validate.middlewares.js";

const router = express.Router();

router.route("/register").post(validate(signUpValidation), registerUser);

router.route("/login").post(validate(signInValidation), loginUser);

export default router;