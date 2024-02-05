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
    SECRET_ACCESS_TOKEN_EXPIRY
} = process.env;