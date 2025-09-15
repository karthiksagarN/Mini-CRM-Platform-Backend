const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Customer = require('../models/Customer');
const segmentationService = require('../services/segmentationService');

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

test('segment evaluation returns matching customers', async () => {
  await Customer.create([
    { email: 'a@example.com', name: 'A', attributes: { spend: 2000, visits: 1 } },
    { email: 'b@example.com', name: 'B', attributes: { spend: 50, visits: 10 } },
    { email: 'c@example.com', name: 'C', attributes: { spend: 12000, visits: 2 } }
  ]);

  const rules = [{ field: 'attributes.spend', operator: 'greaterThan', value: 1000 }];
  const { customers, count } = await segmentationService.evaluateRules(rules);
  expect(count).toBe(2);
  const emails = customers.map((c) => c.email).sort();
  expect(emails).toEqual(['a@example.com', 'c@example.com']);
});
