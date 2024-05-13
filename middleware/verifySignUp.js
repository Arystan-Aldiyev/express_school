const db = require('../models');
const User = db.user;

const checkDuplicateEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
    
        if (user) {
            return res.status(400).send({ message: "Failed! Email is already in use!" });
        }
    
        next();
    } catch (error) {
        res.status(500).send({ message: "Failed to check duplicate email.", error: error.message });
    }
};

const checkDuplicatePhoneNumber = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { phone_number: req.body.phone_number } });
    
        if (user) {
            return res.status(400).send({ message: "Failed! Phone number is already in use!" });
        }
    
        next();
    } catch (error) {
        res.status(500).send({ message: "Failed to check duplicate phone number.", error: error.message });
    }
};

const verifySignUp = {
    checkDuplicateEmail,
    checkDuplicatePhoneNumber
};

module.exports = verifySignUp;
