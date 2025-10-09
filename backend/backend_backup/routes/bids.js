
const express = require('express');
const { protect } = require('../middleware/auth');
const { bidLimiter } = require('../middleware/limits');
const { placeV } = require('../validation/bid');
const C = require('../controllers/bid');
const r = express.Router({ mergeParams: true });
r.get('/', C.list);
r.post('/', protect, bidLimiter, placeV, C.place);
module.exports = r;
