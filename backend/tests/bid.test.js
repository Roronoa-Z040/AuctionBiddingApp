
const { expect } = require('chai');
const sinon = require('sinon');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const C = require('../controllers/bid');

describe('Bid Controller', () => {
  afterEach(() => sinon.restore());

  it('place: rejects when amount <= current', async () => {
    const req = { params: { id: 'a1' }, user: { _id: 'u2' }, body: { amount: 50 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    sinon.stub(Auction, 'findById').resolves({ _id: 'a1', createdBy: 'u3', status: 'ACTIVE', endDate: '2099-01-01', currentPrice: 80, startingPrice: 10 });
    await C.place(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('place: succeeds and returns 201', async () => {
    const req = { params: { id: 'a1' }, user: { _id: 'u2' }, body: { amount: 120 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const a = { _id: 'a1', createdBy: 'u3', status: 'ACTIVE', endDate: '2099-01-01', currentPrice: 100, startingPrice: 10, save: sinon.stub().resolves() };
    sinon.stub(Auction, 'findById').resolves(a);
    sinon.stub(Bid, 'create').resolves({ _id: 'b1', auction: 'a1', bidder: 'u2', amount: 120, createdAt: new Date() });
    await C.place(req, res);
    expect(res.status.calledWith(201)).to.be.true;
  });
});
