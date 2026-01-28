require('dotenv').config();
const session = require('express-session');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'fallback_secret', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 1000 * 60 * 60 // 1 hour
  }
});

module.exports = sessionMiddleware;