const mongoose = require('mongoose');

module.exports = async function connect(uri) {
  if (!uri) throw new Error('MongoDB URI is required');

  mongoose.set('strictQuery', false);

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to', uri);
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });

  return mongoose;
};
