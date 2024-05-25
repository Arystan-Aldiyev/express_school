const express = require('express');
const router = express.Router();
const { verifyToken, verifyIsAdmin, verifyIsTeacher } = require('../middleware/authJwt');
const questionController = require('../controllers/question.controller');

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: API for managing questions
 */

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Retrieve a list of questions
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 */
router.get('/questions', [verifyToken, verifyIsAdmin || verifyIsTeacher], questionController.findAllQuestions);

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Retrieve a single question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The question ID
 *     responses:
 *       200:
 *         description: A single question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 */
router.get('/questions/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], questionController.findOneQuestion);

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 */
router.post('/questions', [verifyToken, verifyIsAdmin || verifyIsTeacher], questionController.createQuestion);

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update a question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 */
router.put('/questions/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], questionController.updateQuestion);

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete a question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The question ID
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 */
router.delete('/questions/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], questionController.deleteQuestion);

/**
 * @swagger
 * /api/questions:
 *   delete:
 *     summary: Delete all questions
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All questions deleted successfully
 */
router.delete('/questions', [verifyToken, verifyIsAdmin || verifyIsTeacher], questionController.deleteAllQuestions);

module.exports = router;
