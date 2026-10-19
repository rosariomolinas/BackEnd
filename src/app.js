const express = require('express');
const cors = require('cors');
const session = require('express-session');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errors');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/robiotics', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
