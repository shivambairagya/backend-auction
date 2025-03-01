const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // Import protect middleware
const Item = require("../models/Item");
const router = express.Router();

// CREATE AUCTION (Protected)
router.post("/auctions", protect, async (req, res) => {
    try {
        const { title, description, startingBid, endTime, imageUrl } = req.body;
        const newAuction = new Item({
            title,
            description,
            startingBid,
            currentBid: startingBid,
            seller: req.user._id, // Assign logged-in user as seller
            endTime,
            imageUrl
        });

        await newAuction.save();
        res.status(201).json(newAuction);
    } catch (error) {
        res.status(500).json({ message: "Error creating auction" });
    }
});

// DELETE AUCTION (Protected, Only Seller)
router.delete("/auctions/:id", protect, async (req, res) => {
    try {
        const auction = await Item.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        // Only allow the auction creator (seller) to delete
        if (auction.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await auction.deleteOne();
        res.json({ message: "Auction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting auction" });
    }
});

module.exports = router;
