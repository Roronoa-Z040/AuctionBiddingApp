/**
 * Facade Pattern: mirrors the user's original auctionController behavior.
 */
const Auction = require('../models/Auction');

class AuctionService {
  async create({ data, ownerId, imageFile }){
    const body = { ...data, createdBy: ownerId };
    if (imageFile) body.imageUrl = `/uploads/${imageFile.filename}`;
    if (!('currentPrice' in body)) body.currentPrice = body.startingPrice;
    const doc = await Auction.create(body);
    return doc;
  }

  async list({ q, status, page=1, limit=10, sortSpec }){
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (status) filter.status = status;

    const skip = (page-1) * limit;
    const [items, total] = await Promise.all([
      Auction.find(filter).sort(sortSpec).skip(skip).limit(limit).populate('createdBy','name email'),
      Auction.countDocuments(filter)
    ]);

    // Lazy status sync to keep ENDED/ACTIVE accurate like user's controller
    const now = new Date(); const ops = [];
    for (const a of items){
      const expected = (new Date(a.endDate) <= now) ? 'ENDED' : 'ACTIVE';
      if (a.status !== expected){
        a.status = expected;
        ops.push({ updateOne: { filter: { _id: a._id }, update: { $set: { status: expected } } } });
      }
    }
    if (ops.length) Auction.bulkWrite(ops).catch(()=>{});

    return { items, total, page, pages: Math.max(1, Math.ceil(total/limit)) };
  }

  async get(id){
    return Auction.findById(id).populate('createdBy','name email');
  }

  async update({ id, ownerId, data, imageFile }){
    const doc = await Auction.findById(id);
    if (!doc) return null;
    if (String(doc.createdBy) !== String(ownerId)) throw new Error('Forbidden');

    const up = { ...data };
    if (imageFile) up.imageUrl = `/uploads/${imageFile.filename}`;
    Object.assign(doc, up);
    await doc.save();
    return doc;
  }

  async remove({ id, ownerId }){
    const doc = await Auction.findById(id);
    if (!doc) return null;
    if (String(doc.createdBy) !== String(ownerId)) throw new Error('Forbidden');
    await doc.deleteOne();
    return true;
  }
}

module.exports = new AuctionService();
