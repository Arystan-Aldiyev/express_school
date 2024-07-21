const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/authJwt');
const answerController = require('../controllers/answer.controller');

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

module.exports = router;
