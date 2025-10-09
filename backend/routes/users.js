
const r = require('express').Router();
const { protect } = require('../middleware/auth');
const V = require('../validation/user');
const C = require('../controllers/user');
r.get('/me', protect, C.me);
r.put('/me', protect, V.updateMeV, C.updateMe);
r.get('/me/participation', protect, C.participation);
r.get('/me/listings', protect, C.myListings);
module.exports = r;
