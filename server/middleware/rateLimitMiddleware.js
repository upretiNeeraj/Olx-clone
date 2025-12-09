const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 tries allowed
    message: "Too many attempts. Please try later.",
});

module.exports = authLimiter