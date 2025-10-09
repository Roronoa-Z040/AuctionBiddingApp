
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { errors } = require('celebrate');
const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auctions', require('./routes/auctions'));
app.use('/api/users', require('./routes/users'));
require('./swagger')(app);
app.get('/api/health', (req,res)=>res.json({ ok:true }));
app.use(errors());
module.exports = app;
