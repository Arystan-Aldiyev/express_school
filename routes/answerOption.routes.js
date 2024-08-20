const express = require('express');
const router = express.Router();
const {verifyToken, verifyIsAdmin, verifyIsTeacher, isAdminOrTeacher} = require('../middleware/authJwt');
const answerOptionController = require('../controllers/answerOption.controller');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AnswerOption:
 *       type: object
 *       required:
 *         - question_id
 *         - option_text
 *       properties:
 *         question_id:
 *           type: integer
 *         option_text:
 *           type: string
 *         is_correct:
 *           type: boolean
 *       example:
 *         question_id: 1
 *         option_text: "Option A"
 *         is_correct: true
 *     AnswerOptionResponse:
 *       type: object
 *       properties:
 *         option_id:
 *           type: integer
 *         question_id:
 *           type: integer
 *         option_text:
 *           type: string
 *         is_correct:
 *           type: boolean
 *       example:
 *         question_id: 1
 *         option_text: "Option A"
 *         is_correct: true
 *     AnswerOptions:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/AnswerOptionResponse'
 * security:
 *   - bearerAuth: []
 *
 * tags:
 *   name: AnswerOptions
 *   description: API for managing answer options
 */

/**
 * @swagger
 * /api/answerOptions:
 *   post:
 *     summary: Create a new answer option
 *     tags: [AnswerOptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnswerOption'
 *     responses:
 *       201:
 *         description: Answer option created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnswerOptionResponse'
 */
router.post('/answerOptions', [verifyToken, isAdminOrTeacher], answerOptionController.createAnswerOption);

/**
 * @swagger
 * /api/answerOptions/bulk:
 *   post:
 *     summary: Create multiple new answer options
 *     tags: [AnswerOptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answerOptions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/AnswerOption'
 *     responses:
 *       201:
 *         description: Answer options created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnswerOptions'
 */
router.post('/answerOptions/bulk', [verifyToken, isAdminOrTeacher], answerOptionController.createAnswerOptionsBulk);

/**
 * @swagger
 * /api/questions/{question_id}/answerOptions/admins:
 *   get:
 *     summary: Retrieve all answer options for a question with answers (admins and teachers)
 *     tags: [AnswerOptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: question_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The question ID
 *     responses:
 *       200:
 *         description: A list of answer options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AnswerOptionResponse'
 */
router.get('/questions/:question_id/answerOptions/admins', [verifyToken, isAdminOrTeacher], answerOptionController.findAllAnswerOptionsForAdmin);

/**
 * @swagger
 * /api/questions/{question_id}/answerOptions:
 *   get:
 *     summary: Retrieve all answer options for a question
 *     tags: [AnswerOptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: question_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The question ID
 *     responses:
 *       200:
 *         description: A list of answer options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AnswerOptionResponse'
 */
router.get('/questions/:question_id/answerOptions', [verifyToken], answerOptionController.findAllAnswerOptions);

/**
 * @swagger
 * /api/answerOptions/{id}:
 *   get:
 *     summary: Retrieve a single answer option by ID
 *     tags: [AnswerOptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The answer option ID
 *     responses:
 *       200:
 *         description: A single answer option
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnswerOptionResponse'
 *       404:
 *         description: Answer option not found
 */
router.get('/answerOptions/:id', [verifyToken, isAdminOrTeacher], answerOptionController.findOneAnswerOption);

/**
 * @swagger
 * /api/answerOptions/{id}:
 *   put:
 *     summary: Update an answer option by ID
 *     tags: [AnswerOptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The answer option ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnswerOption'
 *     responses:
 *       200:
 *         description: Answer option updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnswerOptionResponse'
 *       404:
 *         description: Answer option not found
 */
router.put('/answerOptions/:id', [verifyToken, isAdminOrTeacher], answerOptionController.updateAnswerOption);

/**
 * @swagger
 * /api/answerOptions/{id}:
 *   delete:
 *     summary: Delete an answer option by ID
 *     tags: [AnswerOptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The answer option ID
 *     responses:
 *       200:
 *         description: Answer option deleted successfully
 *       404:
 *         description: Answer option not found
 */
router.delete('/answerOptions/:id', [verifyToken, isAdminOrTeacher], answerOptionController.deleteAnswerOption);

/**
 * @swagger
 * /api/questions/{question_id}/answerOptions:
 *   delete:
 *     summary: Delete all answer options for a question
 *     tags: [AnswerOptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: question_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The question ID
 *     responses:
 *       200:
 *         description: All answer options deleted successfully
 */
router.delete('/questions/:question_id/answerOptions', [verifyToken, isAdminOrTeacher], answerOptionController.deleteAllAnswerOptions);

module.exports = router;
