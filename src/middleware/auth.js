const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }
        // TODO: Implement token verification
        next();
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized' });
    }
};

module.exports = {
    authMiddleware
};