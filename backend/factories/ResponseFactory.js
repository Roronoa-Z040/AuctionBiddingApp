function userDTO(u){
  if(!u) return null;
  return { _id: u._id, name: u.name, email: u.email, role: u.role };
}
function auctionDTO(a){
  if(!a) return null;
  return {
    _id: a._id,
    title: a.title,
    description: a.description,
    imageUrl: a.imageUrl,
    startingPrice: a.startingPrice,
    currentPrice: a.currentPrice,
    endDate: a.endDate,
    status: a.status,
    createdBy: a.createdBy?._id ? userDTO(a.createdBy) : a.createdBy
  };
}
module.exports = { userDTO, auctionDTO };
