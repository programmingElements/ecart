import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message;

    return res.status(status).json(new ApiError(status, message))
}


export {errorHandler};