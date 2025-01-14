import express from 'express';
import { loginUsernameValidation, createUserValidation } from '../middlewares/UserMiddleware.js';
import { jwtValidation } from '../middlewares/AuthMiddleware.js';


import { loginUsingUsername, createUser, logoutUser, getUserDetail } from '../controllers/UserController.js';

const UserRouter = express.Router();

// full path: /api/user/...
UserRouter.post('/login', loginUsernameValidation, (req, res, next) => {
  console.log('Login request received');
  next();
}, loginUsingUsername);
UserRouter.post('/register', createUserValidation, createUser) // create user using username, email, password
UserRouter.post('/logout', jwtValidation, logoutUser) // auth protected, call this endpoint to logout

UserRouter.get("/details", jwtValidation, getUserDetail) // auth protected, call this to identify the role as HR or employee. 

export default UserRouter
