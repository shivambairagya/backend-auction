const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startingBid: { type: Number, required: true, min: 0 },
    currentBid: { type: Number, default: 0 },
    bidHistory: [
        {
            bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            bidAmount: { type: Number, required: true },
            bidTime: { type: Date, default: Date.now }
        }
    ],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String }, // Optional field for images
    status: { 
        type: String, 
        enum: ["active", "closed"], 
        default: "active" 
    },
    endTime: { type: Date, required: true }
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
