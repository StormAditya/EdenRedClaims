const jwt = require('jsonwebtoken');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me'

const isAuth = (req, res, next) => {  
  const authorization = req.headers.authorization || '';
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.slice(7).trim(); // Bearer XXXXXX
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ message: 'Invalid Token', details: err.message });
    }
  }
  return res.status(401).json({ message: 'No Token provided or bad Authorization header' });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: 'Invalid Admin Token' });
};

module.exports = {isAdmin, isAuth};