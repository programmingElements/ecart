import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    size: {
        type: String
    },
    imageUrl: {
        type: String, // cloudinary url
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
})

export const Product = mongoose.model("Product", productSchema);