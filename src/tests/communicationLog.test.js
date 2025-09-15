const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const CommunicationLog = require('../models/CommunicationLog');

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
  await CommunicationLog.deleteMany({});
});

test('create and query logs', async () => {
  const now = new Date();
  const log1 = await CommunicationLog.create({ campaignId: new mongoose.Types.ObjectId(), customerId: new mongoose.Types.ObjectId(), status: 'sent', sentAt: now });
  const log2 = await CommunicationLog.create({ campaignId: log1.campaignId, customerId: new mongoose.Types.ObjectId(), status: 'failed', sentAt: new Date(now.getTime() - 100000) });

  const found = await CommunicationLog.find({ campaignId: log1.campaignId }).lean();
  expect(found.length).toBe(2);
});
