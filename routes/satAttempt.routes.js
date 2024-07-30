const express = require('express');
const router = express.Router();
const {verifyToken, verifyIsAdmin} = require('../middleware/authJwt');
const satAttemptController = require('../controllers/satAttempt.controller');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Attempt:
 *       type: object
 *       required:
 *         - user_id
 *         - test_id
 *       properties:
 *         attempt_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         test_id:
 *           type: integer
 *         start_time:
 *           type: string
 *           format: date-time
 *         end_time:
 *           type: string
 *           format: date-time
 *         verbal_score:
 *           type: integer
 *         sat_score:
 *           type: integer
 *         total_score:
 *           type: integer
 *       example:
 *         attempt_id: 1
 *         user_id: 1
 *         test_id: 1
 *         start_time: "2024-07-21T09:00:00Z"
 *         end_time: "2024-07-21T11:00:00Z"
 *         verbal_score: 30
 *         sat_score: 40
 *         total_score: 70
 *     Answer:
 *       type: object
 *       properties:
 *         question_id:
 *           type: integer
 *         selected_option:
 *           type: integer
 *       example:
 *         question_id: 1
 *         selected_option: 2
 *
 * security:
 *   - bearerAuth: []
 *
 * tags:
 *   name: SAT Attempts
 *   description: API for managing SAT Attempts
 */

/**
 * @swagger
 * /api/satAttempts/user/{user_id}:
 *   get:
 *     summary: Retrieve all attempts for a user
 *     tags: [SAT Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attempt'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/satAttempts/user/:user_id', [verifyToken], satAttemptController.findAllAttempts);

/**
 * @swagger
 * /api/satAttempts/{attempt_id}/user/{user_id}/answers:
 *   get:
 *     summary: Retrieve all answers for an attempt
 *     tags: [SAT Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attempt_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the attempt
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of answers for the attempt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attempt:
 *                   $ref: '#/components/schemas/Attempt'
 *                 answers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Answer'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Attempt not found
 *       500:
 *         description: Server error
 */
router.get('/satAttempts/:attempt_id/user/:user_id/answers', [verifyToken], satAttemptController.findAnswersForAttempt);

/**
 * @swagger
 * /api/satAttempts/{id}:
 *   delete:
 *     summary: Delete an attempt by ID (admin only)
 *     tags: [SAT Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the attempt
 *     responses:
 *       200:
 *         description: Attempt deleted successfully
 *       404:
 *         description: Attempt not found
 *       500:
 *         description: Server error
 */
router.delete('/satAttempts/:id', [verifyToken], satAttemptController.deleteAttempt);

module.exports = router;
