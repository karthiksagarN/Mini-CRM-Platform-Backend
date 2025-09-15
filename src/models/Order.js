const { nanoid } = require('nanoid'); 
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  productId: { type: String },
  quantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 }
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, default: () => nanoid(10), unique: true }, // Add this line   if we want uniqe order id for each order
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: { type: [ItemSchema], default: [] },
  totalAmount: { type: Number, default: 0 },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
});

module.exports = mongoose.model('Order', OrderSchema);
