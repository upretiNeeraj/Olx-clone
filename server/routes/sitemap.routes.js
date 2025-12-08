const express = require("express");
const router = express.Router();
const Ad = require("../models/ad.model");

router.get("/sitemap.xml", async (req, res) => {
    try {
        const ads = await Ad.find().select("_id updatedAt");

        let urls = ads
            .map(ad => {
                return `
                    <url>
                        <loc>https://your-domain.com/ad/${ad._id}</loc>
                        <lastmod>${ad.updatedAt.toISOString()}</lastmod>
                        <changefreq>weekly</changefreq>
                        <priority>0.8</priority>
                    </url>
                `;
            })
            .join("");

        const staticPages = `
            <url><loc>https://your-domain.com/</loc></url>
            <url><loc>https://your-domain.com/about</loc></url>
            <url><loc>https://your-domain.com/contact</loc></url>
        `;

        const xml = `
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                ${staticPages}
                ${urls}
            </urlset>
        `;

        res.header("Content-Type", "application/xml");
        res.send(xml);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error generating sitemap");
    }
});

module.exports = router;
