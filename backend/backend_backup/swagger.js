
const ui = require('swagger-ui-express');
const doc = {
  openapi: '3.0.0',
  info: { title: 'Online Auction API', version: '1.3.0' },
  servers: [{ url: 'http://127.0.0.1:5001' }],
  paths: {
    '/api/auth/register': { post: { summary: 'Register' } },
    '/api/auth/login': { post: { summary: 'Login' } },
    '/api/auctions': { get: { summary: 'List' }, post: { summary: 'Create' } },
    '/api/auctions/{id}': { get: { summary: 'Get' }, put: { summary: 'Update' }, delete: { summary: 'Delete' } },
    '/api/auctions/{id}/bids': { get: { summary: 'List bids' }, post: { summary: 'Place bid' } },
    '/api/users/me': { get: { summary: 'Me' }, put: { summary: 'Update Me' } },
    '/api/users/me/participation': { get: { summary: 'My participation' } },
    '/api/users/me/listings': { get: { summary: 'My listings' } }
  }
};
module.exports = (app) => app.use('/api/docs', ui.serve, ui.setup(doc));
