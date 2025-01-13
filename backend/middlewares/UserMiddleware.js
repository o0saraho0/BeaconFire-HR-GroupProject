import validator from 'validator';

export const loginUsernameValidation = (req, res, next) => {
  const { username, password } = req.body;
  if (
    !username ||
    !password ||
    validator.isEmpty(username) ||
    validator.isEmpty(password)
  ) {
    return res.status(400).json({ message: 'Missing username fields!' });
  }

  if (!validator.isAlphanumeric(username)) {
    return res.status(400).json({ message: 'Username must be alphanumeric!' });
  }

  next();
};

export const createUserValidation = (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    validator.isEmpty(username) ||
    validator.isEmpty(email) ||
    validator.isEmpty(password)
  ) {
    return res.status(400).json({ message: 'Missing required fields!' });
  }

  if (!validator.isAlphanumeric(username)) {
    return res.status(400).json({ message: 'Username must be alphanumeric!' });
  }

  if (!validator.isLength(username, { min: 4, max: 32 })) {
    return res.status(400).json({ message: 'Username must be between 4 and 32 characters!' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format!' });
  }

  if (!validator.isLength(email, { min: 4, max: 32 })) {
    return res.status(400).json({ message: 'Email must be between 4 and 32 characters!' });
  }

  if (!validator.isLength(password, { max: 32 })) {
    return res.status(400).json({ message: 'Password must be at most 32 characters!' });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: 'Password is too weak!' });
  }

  next();
};