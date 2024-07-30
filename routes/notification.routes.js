const express = require('express');
const router = express.Router();
const {verifyToken, verifyIsAdmin, verifyIsTeacher} = require('../middleware/authJwt');
const notificationController = require('../controllers/notification.controller');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *     Notification:
 *       type: object
 *       properties:
 *         notification_id:
 *           type: integer
 *         message:
 *           type: string
 *         sender_id:
 *           type: integer
 *         group_id:
 *           type: integer
 *         sender:
 *           $ref: '#/components/schemas/User'
 *
 * security:
 *   - bearerAuth: []
 *
 * /api/notifications:
 *   post:
 *     summary: Create a new notification (only admins and teachers)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               group_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 *   get:
 *     summary: Retrieve all notifications for the logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /api/notifications/{id}:
 *   get:
 *     summary: Retrieve a specific notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The notification id
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete a specific notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The notification id
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal Server Error
 *
 * /api/notifications/clear:
 *   delete:
 *     summary: Clear all notifications for the logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications cleared
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router.post('/notifications', [verifyToken, verifyIsAdmin || verifyIsTeacher], notificationController.createNotification);

router.get('/notifications', [verifyToken], notificationController.getNotifications);

router.get('/notifications/:id', [verifyToken], notificationController.getNotificationById);

router.delete('/notifications/clear', [verifyToken], notificationController.clearAllNotifications);

router.delete('/notifications/:id', [verifyToken], notificationController.deleteNotification);

module.exports = router;