const express = require('express');
const router = express.Router();
const {verifyToken, verifyIsAdmin, verifyIsTeacher} = require('../middleware/authJwt');
const satAnswerOptionController = require('../controllers/satAnswerOption.controller');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     SatAnswerOption:
 *       type: object
 *       required:
 *         - option_text
 *         - question_id
 *       properties:
 *         sat_answer_option_id:
 *           type: integer
 *         option_text:
 *           type: string
 *         question_id:
 *           type: integer
 *         is_correct:
 *           type: boolean
 *       example:
 *         sat_answer_option_id: 1
 *         option_text: "This is an answer option."
 *         question_id: 1
 *         is_correct: false
 *
 * security:
 *   - bearerAuth: []
 *
 * tags:
 *   name: SAT Answer Options
 *   description: API for managing SAT Answer Options
 */

/**
 * @swagger
 * /api/satAnswerOptions:
 *   post:
 *     summary: Create a new answer option (admin or teacher only)
 *     tags: [SAT Answer Options]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SatAnswerOption'
 *     responses:
 *       201:
 *         description: Answer option created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SatAnswerOption'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/satAnswerOptions', [verifyToken, verifyIsAdmin || verifyIsTeacher], satAnswerOptionController.createAnswerOption);

/**
 * @swagger
 * /api/satAnswerOptions/bulk:
 *   post:
 *     summary: Create multiple answer options (admin or teacher only)
 *     tags: [SAT Answer Options]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/SatAnswerOption'
 *     responses:
 *       201:
 *         description: Answer options created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SatAnswerOption'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/satAnswerOptions/bulk', [verifyToken, verifyIsAdmin || verifyIsTeacher], satAnswerOptionController.createAnswerOptionsBulk);

/**
 * @swagger
 * /api/satAnswerOptions/question/{question_id}:
 *   get:
 *     summary: Retrieve all answer options for a question
 *     tags: [SAT Answer Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: question_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the question
 *     responses:
 *       200:
 *         description: A list of answer options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SatAnswerOption'
 *       404:
 *         description: Answer options not found
 *       500:
 *         description: Server error
 */
router.get('/satAnswerOptions/question/:question_id', [verifyToken], satAnswerOptionController.findAllAnswerOptions);

/**
 * @swagger
 * /api/satAnswerOptions/{id}:
 *   get:
 *     summary: Retrieve a single answer option by ID
 *     tags: [SAT Answer Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the answer option
 *     responses:
 *       200:
 *         description: A single answer option
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SatAnswerOption'
 *       404:
 *         description: Answer option not found
 *       500:
 *         description: Server error
 */
router.get('/satAnswerOptions/:id', [verifyToken], satAnswerOptionController.findOneAnswerOption);

/**
 * @swagger
 * /api/satAnswerOptions/{id}:
 *   put:
 *     summary: Update an answer option by ID (admin or teacher only)
 *     tags: [SAT Answer Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the answer option
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SatAnswerOption'
 *     responses:
 *       200:
 *         description: Answer option updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SatAnswerOption'
 *       404:
 *         description: Answer option not found
 *       500:
 *         description: Server error
 */
router.put('/satAnswerOptions/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], satAnswerOptionController.updateAnswerOption);

/**
 * @swagger
 * /api/satAnswerOptions/{id}:
 *   delete:
 *     summary: Delete an answer option by ID (admin or teacher only)
 *     tags: [SAT Answer Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the answer option
 *     responses:
 *       200:
 *         description: Answer option deleted successfully
 *       404:
 *         description: Answer option not found
 *       500:
 *         description: Server error
 */
router.delete('/satAnswerOptions/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], satAnswerOptionController.deleteAnswerOption);

/**
 * @swagger
 * /api/satAnswerOptions/question/{question_id}/clear:
 *   delete:
 *     summary: Delete all answer options for a question (admin or teacher only)
 *     tags: [SAT Answer Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: question_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the question
 *     responses:
 *       200:
 *         description: Answer options deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/satAnswerOptions/question/:question_id/clear', [verifyToken, verifyIsAdmin || verifyIsTeacher], satAnswerOptionController.deleteAllAnswerOptions);

module.exports = router;
