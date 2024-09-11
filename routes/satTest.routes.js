const express = require('express');
const router = express.Router();
const {verifyToken, verifyIsAdmin, isAdminOrTeacher} = require('../middleware/authJwt');
const satTestController = require('../controllers/satTest.controller');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     SatTest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         sat_test_id:
 *           type: integer
 *         name:
 *           type: string
 *       example:
 *         sat_test_id: 1
 *         name: "Math Test"
 *     SatAnswer:
 *       type: object
 *       properties:
 *         question_id:
 *           type: integer
 *         option_id:
 *           type: integer
 *       example:
 *         question_id: 1
 *         option_id: 2
 *     SatQuestion:
 *       type: object
 *       properties:
 *         sat_question_id:
 *           type: integer
 *         text:
 *           type: string
 *         section:
 *           type: string
 *         question_type:
 *           type: string
 *       example:
 *         sat_question_id: 1
 *         text: "What is 2 + 2?"
 *         section: "Math"
 *         question_type: "Writing"
 *     SatAnswerOption:
 *       type: object
 *       properties:
 *         sat_answer_option_id:
 *           type: integer
 *         text:
 *           type: string
 *       example:
 *         sat_answer_option_id: 1
 *         text: "4"
 *
 * security:
 *   - bearerAuth: []
 *
 * tags:
 *   name: SAT Tests
 *   description: API for managing SAT Tests
 */

/**
 * @swagger
 * /api/satTests:
 *   post:
 *     summary: Create a new SAT test (admin only)
 *     tags: [SAT Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Math Test"
 *               deadlines:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     group_id:
 *                       type: integer
 *                       example: 1
 *                     open:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-15T09:00:00Z"
 *                     due:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-15T11:00:00Z"
 *     responses:
 *       201:
 *         description: SAT test created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SatTest'
 *       500:
 *         description: Server error
 */

router.post('/satTests', [verifyToken, isAdminOrTeacher], satTestController.createSatTest);

/**
 * @swagger
 * /api/satTests:
 *   get:
 *     summary: Retrieve all SAT tests
 *     tags: [SAT Tests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of SAT tests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SatTest'
 *       500:
 *         description: Server error
 */
router.get('/satTests', [verifyToken], satTestController.getAllSatTests);

/**
 * @swagger
 * /api/satTests/{id}:
 *   get:
 *     summary: Retrieve a single SAT test by ID
 *     tags: [SAT Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the SAT test
 *     responses:
 *       200:
 *         description: A single SAT test
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SatTest'
 *       404:
 *         description: SAT test not found
 *       500:
 *         description: Server error
 */
router.get('/satTests/:id', [verifyToken], satTestController.getSatTestById);

/**
 * @swagger
 * /api/satTests/{id}/details:
 *   get:
 *     summary: Retrieve a single SAT test with detailed questions and answers by ID
 *     tags: [SAT Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the SAT test
 *     responses:
 *       200:
 *         description: A single SAT test with detailed questions and answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sat_test_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 questionsBySection:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/SatQuestion'
 *       404:
 *         description: SAT test not found
 *       500:
 *         description: Server error
 */
router.get('/satTests/:id/details', [verifyToken], satTestController.getSatTestWithDetails);

/**
 * @swagger
 * /api/satTests/{id}:
 *   put:
 *     summary: Update a SAT test by ID (admin only)
 *     tags: [SAT Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the SAT test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SatTest'
 *     responses:
 *       200:
 *         description: SAT test updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SatTest'
 *       404:
 *         description: SAT test not found
 *       500:
 *         description: Server error
 */
router.put('/satTests/:id', [verifyToken, isAdminOrTeacher], satTestController.updateSatTest);

/**
 * @swagger
 * /api/satTests/{id}:
 *   delete:
 *     summary: Delete a SAT test by ID (admin only)
 *     tags: [SAT Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the SAT test
 *     responses:
 *       200:
 *         description: SAT test deleted successfully
 *       404:
 *         description: SAT test not found
 *       500:
 *         description: Server error
 */
router.delete('/satTests/:id', [verifyToken, isAdminOrTeacher], satTestController.deleteSatTest);

/**
 * @swagger
 * /api/satTests/{id}/submit:
 *   post:
 *     summary: Submit SAT test
 *     tags: [SAT Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the SAT test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: object
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question_id:
 *                         type: integer
 *                         description: The ID of the SAT question
 *                       option_id:
 *                         type: integer
 *                         description: The ID of the selected option
 *                       isMarked:
 *                         type: boolean
 *                         description: Whether the question was marked by the user
 *                         default: false
 *                         example: false
 *     responses:
 *       200:
 *         description: Test submitted successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Server error
 */
router.post('/satTests/:id/submit', [verifyToken], satTestController.submitSatTest);

module.exports = router;