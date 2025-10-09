
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
exports.place = async (req, res) => {
  try {
    const { amount } = req.body;
    const a = await Auction.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Auction not found' });
    if (a.status === 'ENDED' || new Date(a.endDate) <= new Date()) return res.status(400).json({ message: 'Auction has ended' });
    if (String(a.createdBy) === String(req.user._id)) return res.status(400).json({ message: 'Owner cannot bid on own auction' });
    const min = Math.max(a.currentPrice || a.startingPrice, a.startingPrice);
    if (amount <= min) return res.status(400).json({ message: `Bid must be greater than ${min}` });
    const bid = await Bid.create({ auction: a._id, bidder: req.user._id, amount });
    a.currentPrice = amount; await a.save();
    try { req.app.get('io')?.to(a._id.toString()).emit('bid:new', { auctionId: a._id.toString(), amount, bidder: req.user._id.toString(), at: bid.createdAt }); } catch {}
    res.status(201).json(bid);
  } catch (e) { res.status(500).json({ message: e.message }); }
};
exports.list = async (req, res) => {
  try {
    const bids = await Bid.find({ auction: req.params.id }).sort({ amount: -1, createdAt: -1 }).limit(50).populate('bidder','name email');
    res.json(bids);
  } catch (e) { res.status(500).json({ message: e.message }); }
};
