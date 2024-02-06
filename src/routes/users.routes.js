import express from "express";
import { getUserInfo, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/users.controllers.js";
import { signInValidation, signUpValidation, refreshTokenValidation } from "../validators/users.validators.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/register").post(validate(signUpValidation), registerUser);

router.route("/login").post(validate(signInValidation), loginUser);

router.route("/refresh").post(refreshAccessToken);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/me").get(verifyJWT, getUserInfo);



export default router;