require('dotenv').config();

const mongooseConnect = require('./config/mongoose');
const app = require('./app');

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

(async () => {
  try {
    await mongooseConnect(MONGODB_URI);
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down gracefully.');
      server.close(() => {
        mongooseConnect.close && mongooseConnect.close();
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();