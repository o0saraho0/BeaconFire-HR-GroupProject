import express from 'express';
import { loginUsernameValidation, createUserValidation } from '../middlewares/UserMiddleware.js';
import { jwtValidation } from '../middlewares/AuthMiddleware.js';
import { createHouse, getAllHouses, getHouseById } from '../controllers/HouseController.js';
import { createFacilityReport, getReportsByHouse, updateReportStatus } from '../controllers/FacilityReportController.js';


import { loginUsingUsername, createUser, logoutUser, getUserDetail } from '../controllers/UserController.js';


const UserRouter = express.Router();

// full path: /api/user/...
UserRouter.post('/login', loginUsernameValidation, loginUsingUsername) // call this endpoint to login using username
UserRouter.post('/register', createUserValidation, createUser) // create user using username, email, password
UserRouter.post('/logout', jwtValidation, logoutUser) // auth protected, call this endpoint to logout

UserRouter.get("/details", jwtValidation, getUserDetail) // auth protected, call this to identify the role as HR or employee. 

export default UserRouter