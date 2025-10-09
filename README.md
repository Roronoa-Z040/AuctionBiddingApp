
# Online Auction – Full Stack (Final)

Complete Online Auction app with:
- JWT auth (register/login)
- Auctions CRUD (+ image upload via Multer)
- Realtime bidding (Socket.IO)
- Auto-close status when end date passes
- Profile: update info & password; see my bids (WON/LOST/LEADING/OUTBID); manage my listings
- Owner-only edit/delete
- About page, sticky footer with social icons
- Swagger docs
- Postman collection in `/postman`

## Quick Start
> Use **Node 18 LTS** (react-scripts is tested on Node 16/18).

```bash
npm install
npm run install-all

cd backend
cp .env.example .env
# Set:
# MONGO_URI=<your MongoDB Atlas connection string>
# JWT_SECRET=<a long random string>
# PORT=5001
cd ..

npm start
```
Front-end: http://localhost:3000  
Back-end: http://127.0.0.1:5001/api/health  
Swagger: http://127.0.0.1:5001/api/docs
