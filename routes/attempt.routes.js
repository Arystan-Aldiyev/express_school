const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authJwt');
const attemptController = require('../controllers/attempt.controller');

/**
 * @swagger
 * /api/attempts:
 *   post:
 *     summary: Create a new attempt
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               test_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Attempt created
 *       400:
 *         description: Invalid request
 */
router.post('/attempts', [verifyToken], attemptController.createAttempt);

/**
 * @swagger
 * /api/attempts/submit:
 *   post:
 *     summary: Submit and evaluate an attempt
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               test_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Attempt submitted and evaluated successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Some error occurred while submitting the attempt
 */
router.post('/attempts/submit', [verifyToken], attemptController.submitAttempt);

/**
 * @swagger
 * /api/users/{user_id}/attempts:
 *   get:
 *     summary: Retrieve all attempts for a user
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
 *     responses:
 *       200:
 *         description: A list of attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attempt'
 */
router.get('/users/:user_id/attempts', [verifyToken], attemptController.findAllAttempts);

/**
 * @swagger
 * /api/attempts/{attempt_id}/answers:
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
 *     responses:
 *       200:
 *         description: A list of answers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Answer'
 */
router.get('/attempts/:attempt_id/answers', [verifyToken], attemptController.findAnswersForAttempt);


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
