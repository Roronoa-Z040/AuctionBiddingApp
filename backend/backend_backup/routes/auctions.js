const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createV, updateV } = require('../validation/auction');
const C = require('../controllers/auction');
const ownershipProxy = require('../proxy/OwnershipProxy'); 

const Auction = require('../models/Auction');                 // <- used by getOwnerId

const r = express.Router();

r.get('/', C.list);
r.get('/:id', C.get);
r.post('/', protect, upload.single('image'), createV, C.create);
r.put('/:id', protect, upload.single('image'), updateV, C.update);

// Only owners can delete
r.delete(
  '/:id',
  protect,
  ownershipProxy(C.remove, {
    getOwnerId: async (req) => (await Auction.findById(req.params.id))?.createdBy,
  })
);

r.use('/:id/bids', require('./bids'));

module.exports = r;

