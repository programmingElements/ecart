import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async (request, response) => {
  const { username, password, email } = request.body;

  // check if user is already exists

  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExists) {
    throw new ApiError(409, "User with email or username already exists.");
  }

  // create the user model
  const user = await User.create({
    username,
    email,
    password,
  });

  if (!user) {
    throw new ApiError(400, "User Creation Failed.");
  }

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  return response
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (request, response) => {

    const {email, password} = request.body;

  // token
  const access_token = user.accessToken();

  if (!access_token) {
    throw new ApiError(400, "Token Creation Failed.");
  }
  return response
    .status(200)
    .json(new ApiResponse(200, {}, "User loggedIn Successfully"));
});

export { registerUser, loginUser };
