const express = require('express');
const router = express.Router();
const { verifyToken, verifyIsAdmin, verifyIsTeacher } = require('../middleware/authJwt');
const satQuestionController = require('../controllers/satQuestion.controller');
const { upload } = require("../services/amazon.s3.service");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     SatQuestion:
 *       type: object
 *       required:
 *         - test_id
 *         - question_text
 *         - section
 *       properties:
 *         question_id:
 *           type: integer
 *         test_id:
 *           type: integer
 *         question_text:
 *           type: string
 *         hint:
 *           type: string
 *         image:
 *           type: string
 *           format: uri
 *         explanation_image:
 *           type: string
 *           format: uri
 *         explanation:
 *           type: string
 *         section:
 *           type: string
 *       example:
 *         question_id: 1
 *         test_id: 1
 *         question_text: "What is 2+2?"
 *         hint: "Simple math question"
 *         image: "https://example.com/image.png"
 *         explanation_image: "https://example.com/explanation_image.png"
 *         explanation: "The sum of 2 and 2 is 4"
 *         section: "Math"
 *
 * security:
 *   - bearerAuth: []
 *
 * tags:
 *   name: SAT Questions
 *   description: API for managing SAT Questions
 */

/**
 * @swagger
 * /api/satQuestions:
 *   post:
 *     summary: Create a new question (admin or teacher only)
 *     tags: [SAT Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               test_id:
 *                 type: integer
 *               question_text:
 *                 type: string
 *               hint:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               explanation_image:
 *                 type: string
 *                 format: binary
 *               explanation:
 *                 type: string
 *               section:
 *                 type: string
 *     responses:
 *       201:
 *         description: Question created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SatQuestion'
 *       500:
 *         description: Server error
 */
router.post('/satQuestions', [verifyToken, verifyIsAdmin || verifyIsTeacher], upload.fields([{ name: 'image', maxCount: 1 }, { name: 'explanation_image', maxCount: 1 }]), satQuestionController.createSatQuestion);

/**
 * @swagger
 * /api/satQuestions:
 *   get:
 *     summary: Retrieve all questions
 *     tags: [SAT Questions]
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
 *                 $ref: '#/components/schemas/SatQuestion'
 *       500:
 *         description: Server error
 */
router.get('/satQuestions', [verifyToken], satQuestionController.findAllQuestions);

/**
 * @swagger
 * /api/satQuestions/section/{section}/test/{test_id}:
 *   get:
 *     summary: Retrieve all questions by section and test ID
 *     tags: [SAT Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: section
 *         schema:
 *           type: string
 *         required: true
 *         description: The section of the test
 *       - in: path
 *         name: test_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the test
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SatQuestion'
 *       500:
 *         description: Server error
 */
router.get('/satQuestions/section/:section/test/:test_id', [verifyToken], satQuestionController.findQuestionsBySectionAndTestId);

/**
 * @swagger
 * /api/satQuestions/test/{test_id}:
 *   get:
 *     summary: Retrieve all questions by test ID
 *     tags: [SAT Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: test_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the test
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SatQuestion'
 *       500:
 *         description: Server error
 */
router.get('/satQuestions/test/:test_id', [verifyToken], satQuestionController.findQuestionsByTestId);

/**
 * @swagger
 * /api/satQuestions/{id}:
 *   get:
 *     summary: Retrieve a single question by ID
 *     tags: [SAT Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the question
 *     responses:
 *       200:
 *         description: A single question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SatQuestion'
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.get('/satQuestions/:id', [verifyToken], satQuestionController.findOneQuestion);

/**
 * @swagger
 * /api/satQuestions/{id}:
 *   put:
 *     summary: Update a question by ID (admin or teacher only)
 *     tags: [SAT Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               test_id:
 *                 type: integer
 *               question_text:
 *                 type: string
 *               hint:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               explanation_image:
 *                 type: string
 *                 format: binary
 *               explanation:
 *                 type: string
 *               section:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SatQuestion'
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.put('/satQuestions/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], upload.fields([{ name: 'image', maxCount: 1 }, { name: 'explanation_image', maxCount: 1 }]), satQuestionController.updateQuestion);

/**
 * @swagger
 * /api/satQuestions/{id}:
 *   patch:
 *     summary: Partially update a question by ID (admin or teacher only)
 *     tags: [SAT Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               test_id:
 *                 type: integer
 *               question_text:
 *                 type: string
 *               hint:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               explanation_image:
 *                 type: string
 *                 format: binary
 *               explanation:
 *                 type: string
 *               section:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SatQuestion'
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.patch('/satQuestions/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], upload.fields([{ name: 'image', maxCount: 1 }, { name: 'explanation_image', maxCount: 1 }]), satQuestionController.patchQuestion);

/**
 * @swagger
 * /api/satQuestions/{id}:
 *   delete:
 *     summary: Delete a question by ID (admin or teacher only)
 *     tags: [SAT Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the question
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.delete('/satQuestions/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], satQuestionController.deleteQuestion);

module.exports = router;
