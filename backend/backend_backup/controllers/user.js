
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Bid = require('../models/Bid');
const Auction = require('../models/Auction');

exports.me = async (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role });
};

exports.updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, currentPassword, newPassword } = req.body || {};
    if (name && name.trim()) user.name = name.trim();
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password required' });
      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });
      user.password = await bcrypt.hash(newPassword, 10);
    }
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.participation = async (req, res) => {
  try {
    const uid = new mongoose.Types.ObjectId(req.user._id);
    const myTop = await Bid.aggregate([
      { $match: { bidder: uid } },
      { $sort: { amount: -1, createdAt: 1 } },
      { $group: { _id: '$auction', myTopBid: { $first: '$amount' } } }
    ]);
    if (myTop.length === 0) return res.json([]);
    const ids = myTop.map(x => x._id);
    const topAll = await Bid.aggregate([
      { $match: { auction: { $in: ids } } },
      { $sort: { amount: -1, createdAt: 1 } },
      { $group: { _id: '$auction', topAmount: { $first: '$amount' }, topBidder: { $first: '$bidder' } } }
    ]);
    const myMap = new Map(myTop.map(x => [String(x._id), x]));
    const topMap = new Map(topAll.map(x => [String(x._id), x]));
    const auctions = await Auction.find({ _id: { $in: ids } }).populate('createdBy','name email');
    const now = new Date();
    const out = auctions.map(a => {
      const id = String(a._id);
      const top = topMap.get(id);
      const mine = myMap.get(id);
      const ended = a.status === 'ENDED' || new Date(a.endDate) <= now;
      let outcome = 'OUTBID';
      if (top?.topBidder?.toString() === uid.toString()) outcome = ended ? 'WON' : 'LEADING';
      else outcome = ended ? 'LOST' : 'OUTBID';
      return {
        auction: { _id: a._id, title: a.title, imageUrl: a.imageUrl, endDate: a.endDate, status: ended ? 'ENDED' : 'ACTIVE', createdBy: a.createdBy },
        myTopBid: mine?.myTopBid ?? null,
        topBid: top?.topAmount ?? (a.currentPrice || a.startingPrice),
        outcome
      };
    });
    res.json(out);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.myListings = async (req, res) => {
  try {
    const { q, page = 1, limit = 10, sort = 'createdAt_desc' } = req.query;
    const filter = { createdBy: req.user._id };
    if (q) filter.$text = { $search: q };
    const sortMap = {
      createdAt_desc: { createdAt: -1 },
      createdAt_asc: { createdAt: 1 },
      currentPrice_desc: { currentPrice: -1 },
      currentPrice_asc: { currentPrice: 1 },
      endDate_asc: { endDate: 1 }
    };
    const spec = sortMap[sort] || { createdAt: -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Auction.find(filter).sort(spec).skip(skip).limit(parseInt(limit)).populate('createdBy','name email'),
      Auction.countDocuments(filter)
    ]);
    res.json({ items, total, page: parseInt(page), pages: Math.max(1, Math.ceil(total / parseInt(limit))) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
