const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authJwt');
const answerController = require('../controllers/answer.controller');

/**
 * @swagger
 * /api/answers:
 *   post:
 *     summary: Create a new answer
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               student_answer:
 *                 type: string
 *               attempt_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Answer created
 *       400:
 *         description: Invalid request
 */
router.post('/answers', [verifyToken], answerController.createAnswer);

/**
 * @swagger
 * /api/questions/{question_id}/answers:
 *   get:
 *     summary: Retrieve all answers for a specific question
 *     tags: [Answers]
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
 *         description: A list of answers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Answer'
 */
router.get('/questions/:question_id/answers', [verifyToken], answerController.findAllAnswersForQuestion);

/**
 * @swagger
 * /api/answers/{answer_id}:
 *   get:
 *     summary: Retrieve a single answer by ID
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answer_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The answer ID
 *     responses:
 *       200:
 *         description: A single answer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Answer'
 *       404:
 *         description: Answer not found
 */
router.get('/answers/:answer_id', [verifyToken], answerController.findOneAnswer);

/**
 * @swagger
 * /api/answers/{answer_id}:
 *   put:
 *     summary: Update an answer by ID
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answer_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The answer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               student_answer:
 *                 type: string
 *               attempt_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Answer updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Answer not found
 */
router.put('/answers/:answer_id', [verifyToken], answerController.updateAnswer);

/**
 * @swagger
 * /api/answers/{answer_id}:
 *   delete:
 *     summary: Delete an answer by ID
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answer_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The answer ID
 *     responses:
 *       200:
 *         description: Answer deleted successfully
 *       404:
 *         description: Answer not found
 */
router.delete('/answers/:answer_id', [verifyToken], answerController.deleteAnswer);

module.exports = router;
