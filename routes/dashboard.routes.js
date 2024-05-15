const express = require('express');
const router = express.Router();

const { verifyToken, verifyIsAdmin } = require('../middleware/authJwt');
const dashboardController = require('../controllers/dashboard.controller');

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

// Routes for announcements
router.post(
    "/announcements",
    [verifyToken, verifyIsAdmin],
    dashboardController.createAnnouncement
);

router.get(
    "/announcements",
    [verifyToken],
    dashboardController.getAnnouncements
);

router.put(
    "/announcements/:id",
    [verifyToken, verifyIsAdmin],
    dashboardController.updateAnnouncement
);

router.delete(
    "/announcements/:id",
    [verifyToken, verifyIsAdmin],
    dashboardController.deleteAnnouncement
);

// Routes for countdowns
router.post(
    "/countdowns",
    [verifyToken, verifyIsAdmin],
    dashboardController.createCountdown
);

router.get(
    "/countdowns",
    [verifyToken],
    dashboardController.getCountdowns
);

router.put(
    "/countdowns/:id",
    [verifyToken, verifyIsAdmin],
    dashboardController.updateCountdown
);

router.delete(
    "/countdowns/:id",
    [verifyToken, verifyIsAdmin],
    dashboardController.deleteCountdown
);

module.exports = router;
