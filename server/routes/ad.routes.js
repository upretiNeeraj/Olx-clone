const express = require("express");
const protect = require("../middleware/authMiddleware");
const Ad = require("../models/ad.model");
const upload = require("../middleware/upload");
const router = express.Router();
const fileUploaderOnClouinary = require("../config/cloudinary")
const fs = require("fs")
//fileUploaderOnClouinary

router.post("/create", protect, upload.single("image"), async (req, res) => {
    try {
        const { title, description, price, location, category } = req.body;

        if (!title || !category) {
            return res.status(400).json({ message: "Title and category are required" });
        }




        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // ✅ Step 1: Upload to Cloudinary
        const uploadResponse = await fileUploaderOnClouinary(req.file.path);
        if (!uploadResponse) {
            return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
        }

        // ✅ Step 2: Get Cloudinary URL
        const imageUrl = uploadResponse.secure_url;

        // ✅ Step 3: (Optional) Delete local temp file
        fs.unlinkSync(req.file.path);





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


module.exports = router;
