const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const orderService = require('../services/orderService');

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
  await Order.deleteMany({});
});

test('createOrders validates customer and calculates total', async () => {
  const cust = await Customer.create({ email: 'x@example.com' });
  const payload = {
    customerId: cust._id.toString(),
    items: [{ productId: 'p1', quantity: 2, price: 10 }, { productId: 'p2', quantity: 1, price: 5 }]
  };
  const order = await orderService.createOrders(payload);
  expect(order.totalAmount).toBe(25);
  expect(order.status).toBe('completed');
});
