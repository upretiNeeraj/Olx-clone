const express = require("express");
const protect = require("../middleware/authMiddleware");
const Ad = require("../models/ad.model");
const upload = require("../middleware/upload");
const router = express.Router();
const fileUploaderOnClouinary = require("../config/cloudinary");
const fs = require("fs");

// CREATE AD
router.post("/create", protect, upload.single("image"), async (req, res) => {
    try {
        const { title, description, price, location, category } = req.body;

        if (!title || !category) {
            return res.status(400).json({ message: "Title and category are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Upload to Cloudinary using buffer
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = fileUploaderOnClouinary.uploader.upload_stream(
                { folder: "ads" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        const imageUrl = uploadResult.secure_url;

        const parsedLocation = location ? JSON.parse(location) : null;

        const ad = await Ad.create({
            title,
            description,
            price: Number(price),
            image: imageUrl,
            location: parsedLocation,
            user: req.user._id,
            category,
        });

        res.status(201).json(ad);
    } catch (err) {
        console.error("Ad create error:", err);
        res.status(500).json({ message: err.message });
    }
});


// All Ads
router.get("/", async (req, res) => {
    try {
        const ads = await Ad.find().populate("user", "name email");
        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// My Ads
router.get("/my", protect, async (req, res) => {
    try {
        const ads = await Ad.find({ user: req.user._id });
        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Single Ad
router.get("/:id", async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id).populate("user", "name email");
        res.json(ad);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE Ad (Fixed)
router.delete("/delete/:id", protect, async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }

        if (ad.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: Not your ad" });
        }

        await ad.deleteOne();

        res.json({ message: "Ad deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
