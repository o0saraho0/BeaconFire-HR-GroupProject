import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Use the correct secret name
        req.user = decoded; // Attach user data
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ error: "Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ error: "Invalid token" });
        }
        return res.status(403).json({ error: "Authentication failed" });
    }
};

export default authenticateUser;