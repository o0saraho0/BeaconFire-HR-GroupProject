import jwt from 'jsonwebtoken';

// This token is used to handle user authenticaltion after user registration.
export const generateJWTToken = (user_id, username, email) => {
    const token = jwt.sign({ user_id, username, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    console.log('Signing with secret:', process.env.ACCESS_TOKEN_SECRET);
    return token;
};