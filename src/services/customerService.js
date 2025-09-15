const { v4: uuidv4 } = require('uuid'); // Add this to the top of the file
const Customer = require('../models/Customer');

exports.createCustomers = async (payload) => {
  if (Array.isArray(payload)) {
    // batch create: use upsert by email to avoid duplicates
    const results = [];
    for (const c of payload) {
      const data = {
        email: c.email,
        name: c.name || '',
        attributes: c.attributes || {}
      };
      const doc = await Customer.findOneAndUpdate({ email: data.email }, data, { upsert: true, new: true, setDefaultsOnInsert: true });
      results.push(doc);
    }
    return results;
  } else {
    const data = {
      email: payload.email,
      name: payload.name || '',
      attributes: payload.attributes || {}
    };
    const doc = await Customer.findOneAndUpdate({ email: data.email }, data, { upsert: true, new: true, setDefaultsOnInsert: true });
    return doc;
  }
};

exports.getCustomerById = async (id) => {
  return Customer.findById(id).lean();
};

exports.findByFilter = async (filter = {}) => {
  return Customer.find(filter).lean();
};
