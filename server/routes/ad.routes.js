const express = require("express");
const protect = require("../middleware/authMiddleware");
const Ad = require("../models/ad.model");
const upload = require("../middleware/upload");
const router = express.Router();
const cloudinary = require("../config/cloudinary");


router.post("/create", protect, upload.single("image"), async (req, res) => {
    try {
        const { title, description, price, location, category } = req.body;

        const parsedLocation = location || null;

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "ads",
                    resource_type: "auto",
                    transformation: [
                        { width: 300, height: 300, crop: "limit" },
                        { fetch_format: "webp" },
                    ],
                },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        const ad = await Ad.create({
            title,
            description,
            price: Number(price),
            image: uploadResult.secure_url,
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



router.get("/", async (req, res) => {
    try {
        const ads = await Ad.find().populate("user", "name email");
        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/my", protect, async (req, res) => {
    try {
        const ads = await Ad.find({ user: req.user._id });
        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id).populate("user", "name email");
        res.json(ad);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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
