import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { User } from "../models/users.models.js";
import {ApiError} from "../utils/ApiError.js";

const registerUser = asyncHandler(async (request, response) => {

    const { username, password, email } = request.body;

    // check if user is exists

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new ApiError(400, "User Already Exists.");
    }

    // create the user model
    const user = await User.create({username, email, password});

    if (!user) {
        throw new ApiError(400, "User Creation Failed.");
    }

    // token
    const access_token = user.accessToken();

    if (!access_token) {
        throw new ApiError(400, "Token Creation Failed.");
    }

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(400, "User Creation Failed.");   
    }

    return response.status(201).json(new ApiResponse(201, {  access_token, createdUser} ,"Register Successful"))
})


export { registerUser }