const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/authJwt');
const attemptController = require('../controllers/attempt.controller');

/**
 * @swagger
 * /api/users/{user_id}/attempts/{test_id}:
 *   get:
 *     summary: Retrieve all attempts for a user and test
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: test_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The test ID
 *     responses:
 *       200:
 *         description: A list of attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   test_id:
 *                     type: integer
 *                   score:
 *                     type: number
 *                     format: float
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attempts not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Some error occurred while retrieving attempts.
 */
router.get('/users/:user_id/attempts/:test_id', [verifyToken], attemptController.findAllAttempts);

/**
 * @swagger
 * /api/attempts/{user_id}/answers/{attempt_id}:
 *   get:
 *     summary: Retrieve all answers for an attempt
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attempt_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The attempt ID
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of answers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Answer'
 *       404:
 *         description: Attempt not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No attempt found with this id for the user."
 *       500:
 *         description: Some error occurred while retrieving answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Some error occurred while retrieving answers."
 */
router.get('/attempts/:user_id/answers/:attempt_id', [verifyToken], attemptController.findAnswersForAttempt);

/**
 * @swagger
 * /api/attempts/{id}:
 *   delete:
 *     summary: Delete an attempt
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The attempt ID
 *     responses:
 *       200:
 *         description: Attempt deleted
 *       404:
 *         description: Attempt not found
 */
router.delete('/attempts/:id', [verifyToken], attemptController.deleteAttempt);

module.exports = router;
