const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const secretKey = config.secret;

const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    token = token.split(" ")[1];  // Assume Bearer token

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }

        req.userId = decoded.user_id;  // Add user id to request
        req.userRole = decoded.role;  // Add user role to request
        next();
    });
};

const verifyIsAdmin = (req, res, next) => {
    if (req.userRole === 'admin') {
        next();
    } else {
        res.status(403).send({ message: "Require Admin Role!" });
    }
};

module.exports = {
    verifyToken,
    verifyIsAdmin
};