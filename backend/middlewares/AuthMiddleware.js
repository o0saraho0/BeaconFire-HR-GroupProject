/*
This file should contain middleware that checks if req contains JWT in the headers.
*/
import validator from 'validator';
import jwt from 'jsonwebtoken';

export const jwtValidation = (req, res, next) => {
  // get token from header
  if (!req.headers.authorization)
    return res.status(401).json({
      message: 'No token present in the header'
    })
  const token = req.headers.authorization.split(' ')[1];

  if (token === 'null' || !token || !token.trim()) {
    return res.status(401).json({
      message: 'No token provided',
    });
  }

  // decode token
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded.user_id || !validator.isMongoId(decoded.user_id)) {
      return res.status(401).json({
        message: 'Invalid token',
      });
    }

    // assign data inside the token to the request body
    // so that we can directly access these data in the request object in the route handler functions
    // in this way, 
    // we don't need user_id to be passed in seperately the from the front end (in request body/params or query strings)
    req.body.user_id = decoded.user_id
    req.body.username = decoded.username
    req.body.email = decoded.email

    // later handelers would have access to JWT content...
    next();
  }
  catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: 'Your session has expired. Please logout and login again.'
      });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}
