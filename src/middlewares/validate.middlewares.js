import {ApiError} from "../utils/ApiError.js";

const validate = (data) => async (req, res, next) => {
    try {
        const parseBody = await data.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error) {
        const status = 422;
        const message = error.issues[0].message;
        return next(new ApiError(status, message));
    }
}

export {validate};