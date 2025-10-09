
const rateLimit = require('express-rate-limit');
exports.authLimiter = rateLimit({ windowMs: 15*60*1000, max: 100 });
exports.bidLimiter = rateLimit({ windowMs: 60*1000, max: 30 });
