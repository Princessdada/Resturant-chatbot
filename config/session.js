require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'fallback_secret', 
  resave: false,
  saveUninitialized: false, // Don't create session until something is stored
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_DB_CONNECTION_URL || process.env.MONGO_URI, // Check .env for exact name
    collectionName: 'sessions'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
});

module.exports = sessionMiddleware;