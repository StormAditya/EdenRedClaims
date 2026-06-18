const jwt = require('jsonwebtoken');
require('dotenv').config()

const isAuth = (req, res, next) => {  
  const authorization = req.headers.authorization;
  const token = authorization && authorization.slice(' ')[1];      // Bearer XXXXXX

  if (token) {
    try{
      jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          next();
        }
      }
    );
    }
    catch(err){
      console.error(err)
      return res.status(403).json({success: false, message: 'Invalid Token'})
    }
    
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

module.exports = {isAdmin, isAuth};