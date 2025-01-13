import validator from 'validator';

const loginUserValidation = (req, res, next) => {
  const { identifier, password } = req.body;
  if (!identifier || !password || validator.isEmpty(identifier) || validator.isEmpty(password)) {
    return res.status(400).json({ message: 'Missing required fields!' });
  }

  if (!validator.isEmail(identifier) && !validator.isAlphanumeric(identifier)) {
    return res.status(400).json({ message: 'Invalid username or email format!' });
  }

  next();
};

export { loginUserValidation };