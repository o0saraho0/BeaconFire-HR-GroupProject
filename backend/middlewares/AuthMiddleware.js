/*
This file should contain middleware that checks if req contains JWT in the headers.
*/
import validator from 'validator';
import jwt from 'jsonwebtoken';
import HRProfile from "../models/HRProfile.js"
import EmployeeProfile from "../models/EmployeeProfile.js"
import JWTRevocationList from '../models/JWTRevocationList.js';

// check if it's logged in, for protecting endpoints that requires JWT.
export const jwtValidation = async (req, res, next) => {

    console.log("tring to validate jwt")
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

    const isRevoked = await JWTRevocationList.findOne({ token });
    if (isRevoked) {
        return res.status(401).json({
            message: 'Token has been revoked',
        });
    }


    console.log("Verifying with secret:", process.env.ACCESS_TOKEN_SECRET);

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
        console.log('decoded', decoded)
        console.log('decoded.email', decoded.email)
        // later handelers would have access to JWT content...
        return next();
    }
    catch (err) {

        console.error(err);

        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Your session has expired. Please logout and login again.'
            });
        }

        return res.status(500).json({ message: err.message });
    }
};

// for protecting endpoints that only HR can have access to 
export const authenticatedHR = async (req, res, next) => {
    const user_id = req.body.user_id

    const hr = await HRProfile.findOne({ user_id })

    if (hr) {
        req.body.hr_id = hr._id
        return next()

    }
    return res.status(403).json({ message: "You are not a HR" })


}

// Check if the logged in user is Employee, for protecting endpoints that only employee can have access to 
export const authenticatedEmployee = async (req, res, next) => {

    const user_id = req.body.user_id

    const employee = await EmployeeProfile.findOne({ user_id })
    console.log('authenticated employee')
    if (employee) {
        req.body.employee_id = employee._id
        return next()
    }
    return res.status(403).json({ message: "You are not a Employee" })

}
