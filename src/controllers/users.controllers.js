import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { SECRET_REFRESH_TOKEN } from "../config/index.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // user.refreshToken = refreshToken;
        // await user.save({validateBeforeSave: false });

        await User.findByIdAndUpdate(user._id, {
          $set: {
            refreshToken: refreshToken
          }
        })

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

/*
  REGISTER USER
*/

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

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  return response
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

/*
  LOGIN USER
*/

const loginUser = asyncHandler(async (request, response) => {

    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const {email, password} = request.body;

    if ([email, password].some((item) => item.length === 0)) {
        throw new ApiError(400, "email or password is required.");
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials.")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return response
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged In Successfully"
        )
    )

});

/*
  Get User Info
*/

const getUserInfo = asyncHandler(async (request, response) => {
    const user = await User
    .findById(request.user._id)
    .select("-password -updatedAt -__v -refreshToken")

    if (!user) {
        throw new ApiError(404, "User Not Found!")
    }

    return response
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Got User Info"
        )
    )
})


/*
  Refresh Token
*/

const refreshAccessToken = asyncHandler(async (request, response) => {
  try {
    const incomingRefreshToken = request.cookies.refreshToken || request.body.refresh_token

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request")
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    SECRET_REFRESH_TOKEN
  )

  const user = await User.findById(decodedToken?.id)

  if (!user) {
    throw new ApiError(401, "Invalid refresh token")
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used")
  }

  const options = {
    httpOnly: true,
    secure: true
  }

  const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshToken(user._id)

  return response
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", newRefreshToken, options)
  .json(
    new ApiResponse(
      200,
      { accessToken, refreshToken: newRefreshToken },
      "Access token refreshed"
    )
  )
  } catch (error) {
    throw new ApiError(
      401, 
      error?.message || "Invalid refresh token"
      )
  }

}) 

/*
  Logout User
*/

const logoutUser = asyncHandler(async (request, response) => {
    const user = await User.findById(request.user._id)

    if (!user) {
        throw new ApiError(401, "Unauthorized user")
    }

    await User.findByIdAndUpdate(user._id, 
    {
      $set: {
        refreshToken: null
      }
    }, 
    {
      new: true
    })

    const options = {
        httpOnly: true,
        secure: true
    }

    return response
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))


})

const changeCurrentPassword = asyncHandler(async (request, response) => {
  const {oldPassword, newPassword} = request.body

  const user = await User.findById(request.user?._id)

  if (!user) {
    throw new ApiError(401, "Unauthorized request")
  }

  const isPasswordValid = user.isPasswordCorrect(oldPassword)

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false })

  return response
  .status(200)
  .json(
    new ApiResponse(200, {}, "Password changed successfully")
  )

})

const updateAccountDetails = asyncHandler(async (request, response) => {
  const { username , email } = request.body

  if (!username || !email) {
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    request.user?._id,
    {
      $set: {
        username,
        email
      }
    },
    {
      new: true
    }
  ).select("-password")

  return response
  .status(200)
  .json(
    new ApiResponse(
      200,
      user,
      "Account details updated successfully"
    )
  )
})

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getUserInfo,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails
};
