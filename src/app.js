const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const segmentRoutes = require('./routes/segmentRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const communicationLogRoutes = require('./routes/communicationLogRoutes');
const aiRoutes = require('./routes/aiRoutes');
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

// Mount routes
app.use('/api/auth', authRoutes);     
app.use('/api/customers', customerRoutes);    // testing done
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentRoutes);     // testing done
app.use('/api/campaigns', campaignRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/communication-logs', communicationLogRoutes);

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));      // testing done - health check ok

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
