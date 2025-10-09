
const r = require('express').Router();
const { register, login } = require('../controllers/auth');
const { authLimiter } = require('../middleware/limits');
r.post('/register', authLimiter, register);
r.post('/login', authLimiter, login);
module.exports = r;
