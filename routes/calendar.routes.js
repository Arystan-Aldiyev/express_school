const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller');
const {verifyToken, verifyIsAdmin, verifyIsTeacher} = require("../middleware/authJwt");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Calendar:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - group_id
 *         - startTime
 *         - endTime
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         group_id:
 *           type: integer
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         title: "Exam Schedule"
 *         description: "Mid-term exams schedule"
 *         group_id: 1
 *         startTime: "2024-07-21T09:00:00Z"
 *         endTime: "2024-07-21T11:00:00Z"
 *
 * security:
 *   - bearerAuth: []
 *
 * tags:
 *   name: Calendars
 *   description: API for managing calendars
 */

/**
 * @swagger
 * /api/calendars:
 *   post:
 *     summary: Create a new calendar only teacher or admin
 *     tags: [Calendars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Calendar'
 *     responses:
 *       201:
 *         description: Calendar created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 */
router.post('/calendars', [verifyToken, verifyIsAdmin || verifyIsTeacher], calendarController.createCalendar);

/**
 * @swagger
 * /api/calendars/my:
 *   get:
 *     summary: Retrieve calendars for the current user
 *     tags: [Calendars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of calendars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Calendar'
 */
router.get('/calendars/my', [verifyToken], calendarController.getMyCalendars);


/**
 * @swagger
 * /api/calendars/{group_id}:
 *   get:
 *     summary: Retrieve calendars by group ID only teacher or admin
 *     tags: [Calendars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The group ID
 *     responses:
 *       200:
 *         description: A list of calendars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Calendar'
 *       404:
 *         description: Calendars not found
 */
router.get('/calendars/:group_id', [verifyToken, verifyIsAdmin || verifyIsTeacher], calendarController.getCalendars);

/**
 * @swagger
 * /api/calendars/calendar/{calendar_id}:
 *   get:
 *     summary: Retrieve a calendar by ID
 *     tags: [Calendars]
 *     parameters:
 *       - in: path
 *         name: calendar_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The calendar ID
 *     responses:
 *       200:
 *         description: A single calendar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 *       404:
 *         description: Calendar not found
 */
router.get('/calendars/calendar/:calendar_id', calendarController.getCalendarById);

/**
 * @swagger
 * /api/calendars/{id}:
 *   put:
 *     summary: Update a calendar by ID only admin or teacher
 *     tags: [Calendars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The calendar ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Calendar'
 *     responses:
 *       200:
 *         description: Calendar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 *       404:
 *         description: Calendar not found
 */
router.put('/calendars/:calendar_id', [verifyToken, verifyIsAdmin || verifyIsTeacher], calendarController.updateCalendar);

/**
 * @swagger
 * /api/calendars/{id}:
 *   delete:
 *     summary: Delete a calendar by ID only admin or teacher
 *     tags: [Calendars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The calendar ID
 *     responses:
 *       200:
 *         description: Calendar deleted successfully
 *       404:
 *         description: Calendar not found
 */
router.delete('/calendars/:calendar_id', [verifyToken, verifyIsAdmin || verifyIsTeacher], calendarController.deleteCalendar);

module.exports = router;
