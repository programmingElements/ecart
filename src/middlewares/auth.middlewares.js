import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SECRET_ACCESS_TOKEN } from "../config/index.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.models.js";


export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, SECRET_ACCESS_TOKEN)

    const user = await User.findById(decodedToken?.id).select("-password")

    if (!user) {
        throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;
    next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")        
    }
})