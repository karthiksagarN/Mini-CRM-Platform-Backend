const orderService = require('../services/orderService');

exports.createOrder = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await orderService.createOrders(payload);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const order = await orderService.findByFilter({});
    res.json(order);
  } catch (err) {
    next(err);
  }
};
