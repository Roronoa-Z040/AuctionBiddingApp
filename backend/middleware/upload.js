
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});
const filter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'));
  cb(null, true);
};
module.exports = multer({ storage, fileFilter: filter, limits: { fileSize: 3 * 1024 * 1024 } });
