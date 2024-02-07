import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

export const {
    APP_PORT,
    CORS_ORIGIN,
    MONGODB_URI,
    DB_NAME,
    SECRET_ACCESS_TOKEN,
    SECRET_ACCESS_TOKEN_EXPIRY,
    SECRET_REFRESH_TOKEN,
    SECRET_REFRESH_TOKEN_EXPIRY,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} = process.env;