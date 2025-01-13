import jwt from 'jsonwebtoken';
import validator from 'validator';

const jwtValidation = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || validator.isEmpty(token)) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.body.userId = decoded.id;
      req.body.username = decoded.username;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          message: 'Your session has expired. Please logout and login again.'
        });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export default jwtValidation;
