
const mongoose = require('mongoose');
const AuctionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  startingPrice: { type: Number, required: true, min: 0 },
  currentPrice: { type: Number, default: 0 },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['ACTIVE', 'ENDED'], default: 'ACTIVE' },
  imageUrl: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
AuctionSchema.index({ title: 'text', description: 'text' });
AuctionSchema.index({ status: 1, endDate: 1 });
module.exports = mongoose.model('Auction', AuctionSchema);
