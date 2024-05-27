const express = require('express');
const router = express.Router();
const { verifyToken, verifyIsAdmin, verifyIsTeacher } = require('../middleware/authJwt');
const attemptController = require('../controllers/attempt.controller');

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
 *         - test_id
 *         - user_id
 *       properties:
 *         attempt_id:
 *           type: integer
 *           description: The auto-generated ID of the attempt
 *         test_id:
 *           type: integer
 *           description: The ID of the test
 *         user_id:
 *           type: integer
 *           description: The ID of the user
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: The start time of the attempt
 *         end_time:
 *           type: string
 *           format: date-time
 *           description: The end time of the attempt
 *         score:
 *           type: integer
 *           description: The score of the attempt
 *       example:
 *         test_id: 1
 *         user_id: 1
 *         start_time: "2024-05-26T12:00:00Z"
 *         end_time: "2024-05-26T12:30:00Z"
 *         score: 90
 */

/**
 * @swagger
 * tags:
 *   name: Attempts
 *   description: API for managing attempts
 */

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
 *             $ref: '#/components/schemas/Attempt'
 *     responses:
 *       201:
 *         description: Attempt created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attempt'
 */
router.post('/attempts', [verifyToken, verifyIsAdmin || verifyIsTeacher], attemptController.createAttempt);

/**
 * @swagger
 * /api/attempts:
 *   get:
 *     summary: Retrieve all attempts
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
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
router.get('/attempts', [verifyToken, verifyIsAdmin || verifyIsTeacher], attemptController.findAllAttempts);

/**
 * @swagger
 * /api/attempts/{id}:
 *   get:
 *     summary: Retrieve a single attempt by ID
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
 *         description: A single attempt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attempt'
 *       404:
 *         description: Attempt not found
 */
router.get('/attempts/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], attemptController.findOneAttempt);

/**
 * @swagger
 * /api/attempts/{id}:
 *   put:
 *     summary: Update an attempt by ID
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attempt'
 *     responses:
 *       200:
 *         description: Attempt updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attempt'
 *       404:
 *         description: Attempt not found
 */
router.put('/attempts/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], attemptController.updateAttempt);

/**
 * @swagger
 * /api/attempts/{id}:
 *   delete:
 *     summary: Delete an attempt by ID
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
 *         description: Attempt deleted successfully
 *       404:
 *         description: Attempt not found
 */
router.delete('/attempts/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], attemptController.deleteAttempt);

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
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                     selected_option_id:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Attempt submitted and evaluated successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Some error occurred while submitting the attempt
 */
router.post('/attempts/submit', [verifyToken], attemptController.submitAttempt);

module.exports = router;
