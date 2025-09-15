// src/config/db.js
const mongoose = require('mongoose');

const DEFAULT_URI = process.env.MONGODB_URI;

const options = {
  // Recommended options for modern mongoose/mongodb drivers
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // connectionPoolSize, serverSelectionTimeoutMS, socketTimeoutMS can be tuned
};

// Exponential backoff retry parameters
const MAX_RETRIES = 10;
const INITIAL_DELAY_MS = 1000; // 1s

let currentRetry = 0;

/**
 * Attempts to connect to MongoDB with exponential backoff retries.
 * Resolves once connected; rejects only after exhausting retries.
 */
async function connectWithRetry(uri = DEFAULT_URI) {
  try {
    await mongoose.connect(uri, options);
    console.log(`MongoDB connected to ${uri}`);
    // Reset retry counter after success
    currentRetry = 0;
    return mongoose;
  } catch (err) {
    currentRetry += 1;
    const isLastAttempt = currentRetry >= MAX_RETRIES;
    console.error(
      `MongoDB connection attempt ${currentRetry} failed: ${err.message}`
    );

    if (isLastAttempt) {
      console.error('MongoDB: exhausted connection retries. Giving up.');
      throw err;
    }

    const delay = INITIAL_DELAY_MS * Math.pow(2, currentRetry - 1);
    console.log(`Retrying MongoDB connection in ${delay} ms...`);
    await new Promise((res) => setTimeout(res, delay));
    return connectWithRetry(uri);
  }
}

// Optional: Attach connection event listeners for helpful debugging
function attachConnectionListeners() {
  const c = mongoose.connection;
  c.on('connected', () =>
    console.log('Mongoose connection event: connected')
  );
  c.on('reconnected', () =>
    console.log('Mongoose connection event: reconnected')
  );
  c.on('disconnected', () =>
    console.warn('Mongoose connection event: disconnected')
  );
  c.on('error', (err) =>
    console.error('Mongoose connection event: error', err)
  );

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('SIGINT received: closing mongoose connection');
    await mongoose.connection.close(false);
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received: closing mongoose connection');
    await mongoose.connection.close(false);
    process.exit(0);
  });
}

module.exports = {
  connectWithRetry,
  attachConnectionListeners,
  mongooseInstance: mongoose,
};