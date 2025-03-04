const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const groupMembership = db.groupMembership;
const User = db.user;

const secretKey = config.secret;

const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({message: "No token provided!"});
    }

    token = token.split(" ")[1];  // Assume Bearer token

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: "Unauthorized!"});
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
        res.status(403).send({message: "Require Admin Role!"});
    }
};

const verifyIsTeacher = (req, res, next) => {
    if (req.userRole === 'teacher') {
        next();
    } else {
        res.status(403).send({message: "Require Teacher Role!"});
    }
};

const verifyIsStudent = (req, res, next) => {
    if (req.userRole === 'student') {
        next();
    } else {
        res.status(403).send({message: "Require Student Role!"});
    }
};

const isAdminOrOwner = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if (user.role === "admin" || user.user_id === parseInt(req.params.id)) {
            next();
            return;
        }
        res.status(403).send({
            message: "Require Admin Role or Owner!"
        });
        return;
    });
};

const verifyIsGroupMember = (req, res, next) => {
    groupMembership.findOne({
        where: {
            user_id: req.userId,
            group_id: req.params.id
        }
    }).then(membership => {
        if (membership) {
            next();
            return;
        }
        res.status(403).send({
            message: "Require Group Member Role!"
        });
        return;
    });
}

const isAdminOrTeacher = (req, res, next) => {
    if (req.userRole === 'teacher') {
        return next();
    }

    if (req.userRole === 'admin') {
        return next();
    }

    return res.status(403).send({
        message: "Require Admin or Teacher role!"
    });
}
const allowTeacherOrAdminOrGroupMember = (req, res, next) => {
    if (req.userRole === 'teacher') {
        return next();
    }

    if (req.userRole === 'admin') {
        return next();
    }

    groupMembership.findOne({
        where: {
            user_id: req.userId,
            group_id: req.params.id
        }
    }).then(membership => {
        if (membership) {
            return next();
        } else {
            return res.status(403).send({message: "Require Group Member Role!"});
        }
    }).catch(err => {
        return res.status(500).send({message: "Internal Server Error"});
    });
};


module.exports = {
    verifyToken,
    verifyIsAdmin,
    verifyIsTeacher,
    verifyIsStudent,
    isAdminOrOwner,
    verifyIsGroupMember,
    isAdminOrTeacher,
    allowTeacherOrAdminOrGroupMember
};