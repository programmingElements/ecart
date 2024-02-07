import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";

const adminUser = asyncHandler(async (req, _, next) => {
    try {
        const user = await User.findOne({ _id: req.user?._id });

        if (user.role === "admin") {
            return next();
        } else {
            throw new ApiError(401, "Unauthorized request")
        }
    } catch (error) {
        return next(error);
    }
})

export { adminUser };