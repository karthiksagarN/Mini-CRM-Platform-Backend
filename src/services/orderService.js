const Order = require('../models/Order');
const Customer = require('../models/Customer');

exports.createOrders = async (payload) => {
  if (Array.isArray(payload)) {
    const results = [];
    for (const o of payload) {
      const order = await exports._createSingleOrder(o);
      results.push(order);
    }
    return results;
  } else {
    return exports._createSingleOrder(payload);
  }
};

exports._createSingleOrder = async (o) => {
  const customer = await Customer.findById(o.customerId);
  if (!customer) throw new Error('Customer not found');

  const total = (o.items || []).reduce(
    (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
    0
  );

  const order = new Order({
    customerId: o.customerId,
    items: o.items,
    totalAmount: total,
    orderDate: o.orderDate || Date.now(),
    status: 'completed'
  });

  await order.save();
  return order;
};

exports.getOrderById = async (id) => {
  return Order.findById(id)
    .populate('customerId', 'name email customerId')
    .lean();
};

exports.findByFilter = async (filter = {}) => {
  return Order.find(filter)
    .populate('customerId', 'name email customerId') // ✅ FIX: populate customer
    .lean();
};
