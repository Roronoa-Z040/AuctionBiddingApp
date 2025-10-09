
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const C = require('../controllers/user');

describe('User Controller', () => {
  afterEach(() => sinon.restore());

  it('me: returns current user', async () => {
    const req = { user: { _id: 'u1', name: 'J', email: 'j@e.com', role: 'USER' } };
    const res = { json: sinon.stub() };
    await C.me(req, res);
    expect(res.json.called).to.be.true;
  });

  it('updateMe: updates name and password', async () => {
    const req = { user: { _id: 'u1' }, body: { name: 'New', currentPassword: 'old', newPassword: 'newpass' } };
    const res = { json: sinon.stub(), status: sinon.stub().returnsThis() };
    const fake = { _id: 'u1', name: 'Old', email: 'x', role: 'USER', password: 'hash', save: sinon.stub().resolves() };
    sinon.stub(User, 'findById').returns({ select: sinon.stub().resolves(fake) });
    sinon.stub(bcrypt, 'compare').resolves(true);
    sinon.stub(bcrypt, 'hash').resolves('nhash');
    await C.updateMe(req, res);
    expect(res.json.called).to.be.true;
  });
});
