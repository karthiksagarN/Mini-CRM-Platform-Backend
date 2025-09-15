const customerService = require('../services/customerService');

exports.createCustomer = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await customerService.createCustomers(payload);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.findByFilter({});
    res.json(customers);
  } catch (err) {
    next(err);
  }
};


exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};
