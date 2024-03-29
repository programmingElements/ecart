import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/products.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/*
  Add Product
*/
const createProduct = asyncHandler(async (request, response) => {
  const productImageUrl = request.file?.path;

  if (!productImageUrl) {
    throw new ApiError(400, "Image Url is Missing");
  }

  const { name, price, description } = request.body;

  if (!name) {
    throw new ApiError(400, "product name is required");
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
    ...request.body,
  });

  if (!product) {
    throw new ApiError(400, "Product Creation Failed!");
  }

  return response
    .status(201)
    .json(new ApiResponse(201, product, "Product Created Successfully"));
});

/*
  Update Product
*/

const updateProduct = asyncHandler(async (request, response) => {
  const productImageUrl = request.file?.path;

  if (!productImageUrl) {
    throw new ApiError(400, "Image Url is Missing");
  }

  const { productId } = request.params;

  if (!productId) {
    throw new ApiError(404, "Product Id is Not Found!");
  }

  const { name, price, description } = request.body;

  if (!name) {
    throw new ApiError(400, "Product Name is required");
  }

  // check if product is already exists
  const productExisted = await Product.findById(productId);

  if (!productExisted) {
    throw new ApiError(404, "Product Not Found!");
  }

  const productImageResponse = await uploadOnCloudinary(productImageUrl);

  // update product
  const product = await Product.findByIdAndUpdate(
    productExisted._id,
    {
      $set: {
        name,
        price,
        description,
        imageUrl: productImageResponse.url,
        user: request.user?._id,
        ...request.body,
      },
    },
    {
      new: true,
    }
  );

  if (!product) {
    throw new ApiError(400, "Product Updation Failed!");
  }

  return response
    .status(200)
    .json(new ApiResponse(200, product, "Product Updated Successfully"));
});


const deleteProduct = asyncHandler( async (request, response) => {
  const { productId } = request.params;

  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    throw new ApiError(408, "Product Deletion Failed!")
  }

  return response.status(200).json(
    new ApiResponse(
      200,
      {},
      "Product Deleted Successfully"
    )
    )
})

const getProducts = asyncHandler(async (request, response) => {
  const products = await Product.find().select("-__v -updatedAt")
  
  if (!products && products.length === 0) {
    throw new ApiError(404, "No Products Found!")
  }

  return response
  .status(200)
  .json(
    new ApiResponse(
      200,
      products,
      "Got All Products"
    )
  )
})

const getProduct = asyncHandler(async (request, response) => {
  const {productId} = request.params;

  if (!productId) {
    throw new ApiError(408, "Product Id is Missing!")
  }

  const product = await Product.findById(productId).select("-updatedAt -__v");

  if (!product) {
    throw new ApiError(404, "Product Not Found!")
  }

  return response
  .status(200)
  .json(
    new ApiResponse(
      200,
      product,
      "Got Single Product"
    )
  )
})

export { createProduct, updateProduct, deleteProduct, getProducts, getProduct };
