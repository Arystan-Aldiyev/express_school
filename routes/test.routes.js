const express = require('express');
const router = express.Router();
const {verifyToken, verifyIsAdmin, verifyIsTeacher} = require('../middleware/authJwt');
const testController = require('../controllers/test.controller');

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
 *         - option_text
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
 *         option_id: 1
 *         question_id: 1
 *         option_text: "Option A"
 *         is_correct: true
 *     Question:
 *       type: object
 *       required:
 *         - question_text
 *       properties:
 *         question_id:
 *           type: integer
 *         test_id:
 *           type: integer
 *         question_text:
 *           type: string
 *         hint:
 *           type: string
 *         answerOptions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AnswerOption'
 *       example:
 *         question_id: 1
 *         test_id: 1
 *         question_text: "What is 2+2?"
 *         hint: "Think about basic addition."
 *         answerOptions:
 *           - option_id: 1
 *             question_id: 1
 *             option_text: "Option A"
 *             is_correct: true
 *           - option_id: 2
 *             question_id: 1
 *             option_text: "Option B"
 *             is_correct: false
 *     Test:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         test_id:
 *           type: integer
 *         group_id:
 *           type: integer
 *         name:
 *           type: string
 *         time_open:
 *           type: string
 *           format: date-time
 *         duration_minutes:
 *           type: integer
 *         max_attempts:
 *           type: integer
 *         questions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Question'
 *       example:
 *         test_id: 1
 *         group_id: 1
 *         name: "Sample Test"
 *         time_open: "2024-05-25T08:00:00Z"
 *         duration_minutes: 60
 *         max_attempts: 3
 *         questions:
 *           - question_id: 1
 *             test_id: 1
 *             question_text: "What is 2+2?"
 *             hint: "Think about basic addition."
 *             answerOptions:
 *               - option_id: 1
 *                 question_id: 1
 *                 option_text: "Option A"
 *                 is_correct: true
 *               - option_id: 2
 *                 question_id: 1
 *                 option_text: "Option B"
 *                 is_correct: false
 *     SubmitTest:
 *       type: object
 *       required:
 *         - answers
 *         - startTime
 *       properties:
 *         answers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: integer
 *                 description: The ID of the question
 *               answer:
 *                 type: integer
 *                 description: The selected answer ID
 *           example:
 *             - question_id: 1
 *               answer: 3
 *             - question_id: 2
 *               answer: 7
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2024-07-19T12:00:00Z"
 *
 * security:
 *   - bearerAuth: []
 *
 * tags:
 *   name: Tests
 *   description: API for managing tests
 */

/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Retrieve a list of tests
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 */
router.get('/tests', [verifyToken], testController.findAllTest);

/**
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     summary: Retrieve a single test by ID
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The test ID
 *     responses:
 *       200:
 *         description: A single test
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: Test not found
 */
router.get('/tests/:id', [verifyToken], testController.findOneTest);

/**
 * @swagger
 * /api/tests/{id}/details:
 *   get:
 *     summary: Retrieve a test by ID including questions and answer options
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The test ID
 *     responses:
 *       200:
 *         description: A test with questions and answer options
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: Test not found
 */
router.get('/tests/:id/details', [verifyToken, verifyIsAdmin || verifyIsTeacher], testController.findTestWithDetails);

/**
 * @swagger
 * /api/tests:
 *   post:
 *     summary: Create a new test
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *     responses:
 *       201:
 *         description: Test created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 */
router.post('/tests', [verifyToken, verifyIsAdmin || verifyIsTeacher], testController.createTest);

/**
 * @swagger
 * /api/tests/{id}:
 *   put:
 *     summary: Update a test by ID
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The test ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *     responses:
 *       200:
 *         description: Test updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: Test not found
 */
router.put('/tests/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], testController.updateTest);

/**
 * @swagger
 * /api/tests/{id}:
 *   delete:
 *     summary: Delete a test by ID
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The test ID
 *     responses:
 *       200:
 *         description: Test deleted successfully
 *       404:
 *         description: Test not found
 */
router.delete('/tests/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], testController.deleteTest);

/**
 * @swagger
 * /api/tests/{id}/submit:
 *   post:
 *     summary: Submit a test
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The test ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitTest'
 *     responses:
 *       200:
 *         description: Successfully submitted the test
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: integer
 *                   description: The calculated score
 *                   example: 5
 *                 timeTaken:
 *                   type: number
 *                   format: float
 *                   description: Time taken to complete the test in seconds
 *                   example: 1800
 *       403:
 *         description: Maximum attempts reached
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Maximum attempts reached
 *       404:
 *         description: Test not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Test not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: string
 */
router.post('/tests/:id/submit', [verifyToken], testController.submitTest);

/**
 * @swagger
 * /api/tests/group/{group_id}:
 *   get:
 *     summary: Retrieve tests by group ID
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The group ID
 *     responses:
 *       200:
 *         description: A list of tests for the group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 *       404:
 *         description: No tests found for this group
 */
router.get('/tests/group/:group_id', [verifyToken], testController.findAllTestByGroupId);

/**
 * @swagger
 * /api/tests/{test_id}/suspend:
 *   post:
 *     summary: Suspend a test
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: test_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The test ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       description: The ID of the question
 *                     answer:
 *                       type: integer
 *                       description: The selected answer ID
 *                 example:
 *                   - question_id: 1
 *                     answer: 3
 *                   - question_id: 2
 *                     answer: 7
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-19T12:00:00Z"
 *     responses:
 *       200:
 *         description: Test suspended successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: An error occurred while suspending the test
 */
router.post('/tests/:test_id/suspend', [verifyToken], testController.suspendTest);

/**
 * @swagger
 * /api/tests/{test_id}/suspend/continue:
 *   get:
 *     summary: Continue a suspended test
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: test_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The test ID
 *     responses:
 *       200:
 *         description: Suspended test continued
 *       404:
 *         description: Test not found or no suspended answers found
 *       500:
 *         description: An error occurred while continuing the test
 */
router.get('/tests/:test_id/suspend/continue', [verifyToken], testController.continueSuspendTest);

module.exports = router;
