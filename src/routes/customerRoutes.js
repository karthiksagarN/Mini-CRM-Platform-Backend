const express = require('express');
const Joi = require('joi');
const validationMiddleware = require('../middlewares/validationMiddleware');
const customerController = require('../controllers/customerController');

const router = express.Router();

const customerSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().allow('', null),
  attributes: Joi.object().optional()
});

const batchSchema = Joi.array().items(customerSchema).min(1);

router.post('/', validationMiddleware([customerSchema, batchSchema]), customerController.createCustomer);
router.get('/:id', customerController.getCustomerById);
router.get('/', customerController.getAllCustomers);  // 👈 new route

module.exports = router;


/*
api 
http://localhost:4000/api/customers/68c21122dd969d5e84bff0e8

response
{
  "_id": "68c21122dd969d5e84bff0e8",
  "name": "Sharma",
  "email": "priya.sharma@example.com",
  "totalSpending": 15250,
  "visits": 28,
  "lastVisit": "2025-09-05T00:00:00.000Z",
  "createdAt": "2025-09-11T00:00:34.558Z",
  "updatedAt": "2025-09-11T00:16:29.913Z",
  "__v": 0
}

*/
