const mongoose = require('mongoose');
module.exports = mongoose.model('Order', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  items: [{ product: String, name: String, price: Number, qty: Number }],
  total: Number,
  address: String,
  status: { type: String, default: 'Placed' },
  createdAt: { type: Date, default: Date.now }
}));