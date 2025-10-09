const auctionService = require('../services/AuctionService');
const { sortStrategyFactory } = require('../services/SortStrategy');

/** Create */
exports.create = async (req, res) => {
  try {
    const doc = await auctionService.create({
      data: req.body,
      ownerId: req.user._id,
      imageFile: req.file
    });
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

/** List & update statuses inline (via service) */
exports.list = async (req, res) => {
  try {
    const { q, status, page = 1, limit = 10, sort = 'createdAt_desc' } = req.query;
    const spec = sortStrategyFactory(sort).getSortSpec();
    const result = await auctionService.list({
      q, status,
      page: parseInt(page),
      limit: parseInt(limit),
      sortSpec: spec
    });
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

/** Read */
exports.get = async (req, res) => {
  try {
    const doc = await auctionService.get(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Auction not found' });
    const should = new Date(doc.endDate) <= new Date() ? 'ENDED' : 'ACTIVE';
    if (doc.status !== should) { doc.status = should; await doc.save(); }
    return res.json(doc);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

/** Update (owner only) */
exports.update = async (req, res) => {
  try {
    const doc = await auctionService.update({
      id: req.params.id,
      ownerId: req.user._id,
      data: req.body,
      imageFile: req.file
    });
    if (!doc) return res.status(404).json({ message: 'Auction not found' });
    return res.json(doc);
  } catch (e) {
    if (e.message === 'Forbidden') return res.status(403).json({ message: 'Forbidden' });
    return res.status(500).json({ message: e.message });
  }
};

/** Delete (owner only) */
exports.remove = async (req, res) => {
  try {
    const ok = await auctionService.remove({
      id: req.params.id,
      ownerId: req.user._id
    });
    if (!ok) return res.status(404).json({ message: 'Auction not found' });
    return res.json({ message: 'Auction deleted' });
  } catch (e) {
    if (e.message === 'Forbidden') return res.status(403).json({ message: 'Forbidden' });
    return res.status(500).json({ message: e.message });
  }
};
