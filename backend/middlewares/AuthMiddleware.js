import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

export default authenticateUser;