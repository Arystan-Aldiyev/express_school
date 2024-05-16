const express = require('express');
const router = express.Router();

const { verifyToken, verifyIsAdmin } = require('../middleware/authJwt');
const dashboardController = require('../controllers/dashboard.controller');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * security:
 *   - bearerAuth: []
 * 
 * /api/dashboard/announcements:
 *   post:
 *     summary: Create a new announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Upload an image
 *               link:
 *                 type: string
 *               link_description:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               event_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       500:
 *         description: Some error happened
 */

router.post(
    "/announcements",
    [verifyToken, verifyIsAdmin, upload.single('image')],
    dashboardController.createAnnouncement
);

/**
 * @swagger
 * /api/dashboard/announcements:
 *   get:
 *     summary: Get all announcements
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of announcements
 *       500:
 *         description: Some error happened
 */
router.get(
    "/announcements",
    [verifyToken],
    dashboardController.getAnnouncements
);

/**
 * @swagger
 * /api/dashboard/announcements/{id}:
 *   put:
 *     summary: Update an announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The announcement id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Upload an image
 *               link:
 *                 type: string
 *               link_description:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               event_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *       404:
 *         description: Announcement not found
 *       500:
 *         description: Some error happened
 */
router.put(
    "/announcements/:id",
    [verifyToken, verifyIsAdmin, upload.single('image')],
    dashboardController.updateAnnouncement
);

/**
 * @swagger
 * /api/dashboard/announcements/{id}:
 *   delete:
 *     summary: Delete an announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The announcement id
 *     responses:
 *       200:
 *         description: Announcement deleted successfully
 *       404:
 *         description: Announcement not found
 *       500:
 *         description: Some error happened
 */
router.delete(
    "/announcements/:id",
    [verifyToken, verifyIsAdmin],
    dashboardController.deleteAnnouncement
);

// Routes for countdowns

/**
 * @swagger
 * /api/dashboard/countdowns:
 *   post:
 *     summary: Create a new countdown
 *     tags: [Countdowns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - target_date
 *             properties:
 *               title:
 *                 type: string
 *               target_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Countdown created successfully
 *       500:
 *         description: Some error happened
 */
router.post(
    "/countdowns",
    [verifyToken, verifyIsAdmin],
    dashboardController.createCountdown
);

/**
 * @swagger
 * /api/dashboard/countdowns:
 *   get:
 *     summary: Get all countdowns
 *     tags: [Countdowns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of countdowns
 *       500:
 *         description: Some error happened
 */
router.get(
    "/countdowns",
    [verifyToken],
    dashboardController.getCountdowns
);

/**
 * @swagger
 * /api/dashboard/countdowns/{id}:
 *   put:
 *     summary: Update a countdown
 *     tags: [Countdowns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The countdown id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               target_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Countdown updated successfully
 *       404:
 *         description: Countdown not found
 *       500:
 *         description: Some error happened
 */
router.put(
    "/countdowns/:id",
    [verifyToken, verifyIsAdmin],
    dashboardController.updateCountdown
);

/**
 * @swagger
 * /api/dashboard/countdowns/{id}:
 *   delete:
 *     summary: Delete a countdown
 *     tags: [Countdowns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The countdown id
 *     responses:
 *       200:
 *         description: Countdown deleted successfully
 *       404:
 *         description: Countdown not found
 *       500:
 *         description: Some error happened
 */
router.delete(
    "/countdowns/:id",
    [verifyToken, verifyIsAdmin],
    dashboardController.deleteCountdown
);

module.exports = router;
