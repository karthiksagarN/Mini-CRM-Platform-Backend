// Basic unit tests for authService JWT generation and verification
const authService = require('../services/authService');
const User = require('../models/User');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

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
  await User.deleteMany({});
});

test('generate and verify jwt', async () => {
  const user = await User.create({ googleId: 'g1', email: 'a@b.com', name: 'A' });
  const token = authService.generateJWT(user);
  expect(typeof token).toBe('string');
  const payload = authService.verifyJWT(token);
  expect(payload.sub).toBe(user._id.toString());
});
