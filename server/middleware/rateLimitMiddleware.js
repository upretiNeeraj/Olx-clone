const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 3, 
    message: "Too many attempts. Please try later.",
});

module.exports = authLimiter