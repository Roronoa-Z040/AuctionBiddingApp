// backend/proxy/OwnershipProxy.js
module.exports = function ownershipProxy(handler, { getOwnerId }) {
  return async function (req, res) {
    try {
      const ownerId = await getOwnerId(req);
      if (String(ownerId) !== String(req.user?._id)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      return handler(req, res);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
};
