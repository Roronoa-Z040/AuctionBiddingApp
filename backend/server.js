require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connect = require('./config/db');
const Auction = require('./models/Auction');

// ---- Health routes so "/" doesn't 404 ----
app.get('/', (_req, res) => {
  res.send('Auction Backend is up ✅');
});
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: Date.now() });
});
// ------------------------------------------

const server = http.createServer(app);

// Allow socket.io from your dev origins; add your public site/domain if needed
const io = new Server(server, {
  cors: { origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }
});
app.set('io', io);
io.on('connection', (s) => {
  s.on('room:auction', (id) => s.join(id));
});

const flip = async () => {
  try {
    const r = await Auction.updateMany(
      { status: 'ACTIVE', endDate: { $lte: new Date() } },
      { $set: { status: 'ENDED' } }
    );
    if (r.modifiedCount) console.log('Auto-closed', r.modifiedCount);
  } catch (e) {
    console.error('flip error:', e.message);
  }
};

const PORT = process.env.PORT || 5001;
connect(process.env.MONGO_URI)
  .then(async () => {
    await flip();
    setInterval(flip, 60 * 1000);
    server.listen(PORT, '0.0.0.0', () =>
      console.log('Server running on port ' + PORT)
    );
  })
  .catch((e) => {
    console.error('DB connect failed', e);
    process.exit(1);
  });
