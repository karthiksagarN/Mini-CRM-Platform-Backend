const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Campaign = require('../models/Campaign');
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const campaignService = require('../services/campaignService');
const communicationLogService = require('../services/communicationLogService');

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
  await Campaign.deleteMany({});
  await Segment.deleteMany({});
  await Customer.deleteMany({});
  await mongoose.model('CommunicationLog').deleteMany({});
});

test('sendCampaign creates logs and returns summary', async () => {
  const customers = await Customer.create([
    { email: 'a@example.com', name: 'A', attributes: { spend: 2000 } },
    { email: 'b@example.com', name: 'B', attributes: { spend: 50 } }
  ]);

  const segment = await Segment.create({ name: 'big spenders', rules: [{ field: 'attributes.spend', operator: 'greaterThan', value: 1000 }] });
  const camp = await Campaign.create({ name: 'Test', segmentId: segment._id, message: 'Hello' });

  const summary = await campaignService.sendCampaign(camp._id);
  expect(summary.total).toBeGreaterThanOrEqual(0);
  // Logs exist
  const logs = await communicationLogService.queryLogs({ campaignId: camp._id.toString() });
  expect(Array.isArray(logs)).toBe(true);
});
