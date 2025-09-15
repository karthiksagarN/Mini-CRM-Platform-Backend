const express = require('express');
const Joi = require('joi');
const validationMiddleware = require('../middlewares/validationMiddleware');
const orderController = require('../controllers/orderController');

const router = express.Router();

const itemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  price: Joi.number().min(0).required()
});

const orderSchema = Joi.object({
  customerId: Joi.string().required(),
  items: Joi.array().items(itemSchema).min(1).required(),
  orderDate: Joi.date().optional()
});

const batchSchema = Joi.array().items(orderSchema).min(1);

router.post('/', validationMiddleware([orderSchema, batchSchema]), orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.get('/', orderController.getAllOrders);  // 👈 new route

module.exports = router;
