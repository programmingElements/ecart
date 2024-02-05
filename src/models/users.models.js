import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN, SECRET_ACCESS_TOKEN_EXPIRY } from "../config/index.js";

const userSchema = mongoose.Schema(
    {
    username: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "customer",
        enum: ["customer", "admin"]
    }
}, 
{
    timestamps: true
}
);


userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
})

userSchema.methods.accessToken = function() {
     return jwt.sign({
        id: this._id,
        email: this.email,
        role: this.role
     },
     SECRET_ACCESS_TOKEN,
     {
        expiresIn: SECRET_ACCESS_TOKEN_EXPIRY
     })
}


const User = mongoose.model("User", userSchema);


export { User };