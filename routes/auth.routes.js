const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { checkDuplicateEmail, checkDuplicatePhoneNumber } = require('../middleware/verifySignUp');

// Middleware to set headers
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
};

// Define the routes
router.post('/signup', [checkDuplicateEmail, checkDuplicatePhoneNumber], authController.signup);
router.post('/signin', authController.signin);

module.exports = router;