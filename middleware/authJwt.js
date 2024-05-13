const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_jwt_key';  // Replace with your secret key

exports.verifyToken = (req, res, next) => {
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

const authJwt = {
    verifyToken
};

module.exports = authJwt;