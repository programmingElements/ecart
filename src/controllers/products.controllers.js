import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Product } from "../models/products.models.js"
import { ApiError } from "../utils/ApiError.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

/*
  Add Product
*/
const createProduct = asyncHandler(async (request, response) => {

    const productImageUrl = request.file?.path;

    if (!productImageUrl) {
        throw new ApiError(400, "Image Url is Missing")
    }

    const {name, price, description} = request.body;

    if (!name) {
        throw new ApiError(400, "product name is required")
    }

    // check if product is already exists
    const productExisted = await Product.findOne({ name });

    if (productExisted) {
        throw new ApiError(408, "Product Already Existed");
    }


    const productImageResponse = await uploadOnCloudinary(productImageUrl);

    // create product
    const product = await Product.create({
        name,
        price,
        description,
        imageUrl: productImageResponse.url,
        user: request.user?._id,
        ...request.body
    })

    if (!product) {
        throw new ApiError(400, "Product Creation Failed!")
    }

    return response
    .status(201)
    .json(
        new ApiResponse(
            201,
            product,
            "Product Created Successfully")
    )
})

export {createProduct}