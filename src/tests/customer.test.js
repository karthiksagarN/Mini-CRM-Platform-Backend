const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const customerService = require('../services/customerService');
const Customer = require('../models/Customer');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Customer.deleteMany({});
});

test('create and retrieve customer', async () => {
  const payload = { email: 'u@example.com', name: 'User', attributes: { spend: 100 } };
  const created = await customerService.createCustomers(payload);
  expect(created.email).toBe('u@example.com');

  const found = await customerService.getCustomerById(created._id);
  expect(found.email).toBe('u@example.com');
});
