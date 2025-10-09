
const { expect } = require('chai');
const sinon = require('sinon');
const Auction = require('../models/Auction');
const C = require('../controllers/auction');

describe('Auction Controller', () => {
  afterEach(() => sinon.restore());

  it('create: should save auction', async () => {
    const req = { user: { _id: 'u1' }, body: { title: 'Camera', startingPrice: 10, endDate: '2030-01-01' }, file: { filename: 'x.jpg' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const doc = { _id: 'a1', ...req.body, createdBy: 'u1', imageUrl: '/uploads/x.jpg', currentPrice: 10 };
    sinon.stub(Auction, 'create').resolves(doc);
    await C.create(req, res);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(doc)).to.be.true;
  });

  it('list: should return items and pages', async () => {
    const req = { query: { page: 1, limit: 10 } };
    const res = { json: sinon.stub() };
    sinon.stub(Auction, 'find').returns({ sort: ()=>({ skip: ()=>({ limit: ()=>({ populate: ()=>[{ _id: 'a1' }] }) }) }) });
    sinon.stub(Auction, 'countDocuments').resolves(1);
    await C.list(req, res);
    const payload = res.json.firstCall.args[0];
    expect(payload).to.have.property('items').that.is.an('array');
    expect(payload).to.have.property('pages');
  });

  it('get: 404 when not found', async () => {
  const req = { params: { id: 'does-not-exist' } };
  const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

  // 👇 key fix: make findById() return an object that has populate().resolves(null)
  sinon.stub(Auction, 'findById').returns({
    populate: sinon.stub().resolves(null),
  });

  await C.get(req, res);

  expect(res.status.calledWith(404)).to.be.true;
  expect(res.json.calledWith({ message: 'Auction not found' })).to.be.true;

  Auction.findById.restore();
});

});
