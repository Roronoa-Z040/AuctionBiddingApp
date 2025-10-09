
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { register, login } = require('../controllers/auth');

describe('Auth Controller', () => {
  afterEach(() => sinon.restore());

  it('register: should create user and return token', async () => {
    const req = { body: { name: 'Test', email: 't@e.com', password: 'secret123' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    sinon.stub(User, 'findOne').resolves(null);
    sinon.stub(bcrypt, 'hash').resolves('hashed');
    const fakeUser = { _id: '1', name: 'Test', email: 't@e.com', role: 'USER' };
    sinon.stub(User, 'create').resolves(fakeUser);

    await register(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    const payload = res.json.firstCall.args[0];
    expect(payload).to.have.property('token');
    expect(payload).to.have.property('user');
    expect(payload.user.email).to.equal('t@e.com');
  });

  it('login: should return token for valid creds', async () => {
    const req = { body: { email: 't@e.com', password: 'secret123' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    const fake = { _id: '1', name: 'Test', email: 't@e.com', role: 'USER', password: 'hashed' };
    sinon.stub(User, 'findOne').returns({ select: sinon.stub().resolves(fake) });
    sinon.stub(bcrypt, 'compare').resolves(true);

    await login(req, res);

    const payload = res.json.firstCall.args[0];
    expect(payload).to.have.property('token');
    expect(payload.user.email).to.equal('t@e.com');
  });
});
