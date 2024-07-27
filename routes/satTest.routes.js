const express = require('express');
const router = express.Router();
const {verifyToken, verifyIsAdmin} = require('../middleware/authJwt');
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
 *         - group_id
 *         - opens
 *         - due
 *       properties:
 *         sat_test_id:
 *           type: integer
 *         name:
 *           type: string
 *         group_id:
 *           type: integer
 *         opens:
 *           type: string
 *           format: date-time
 *         due:
 *           type: string
 *           format: date-time
 *       example:
 *         sat_test_id: 1
 *         name: "Math Test"
 *         group_id: 1
 *         opens: "2024-07-21T09:00:00Z"
 *         due: "2024-07-21T11:00:00Z"
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
 *       example:
 *         sat_question_id: 1
 *         text: "What is 2 + 2?"
 *         section: "Math"
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
 *             $ref: '#/components/schemas/SatTest'
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
router.post('/satTests', [verifyToken, verifyIsAdmin], satTestController.createSatTest);

/**
 * @swagger
 * /api/satTests/group/{group_id}:
 *   get:
 *     summary: Retrieve all SAT tests by group ID
 *     tags: [SAT Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the group
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
router.get('/satTests/group/:group_id', [verifyToken], satTestController.getSatTestsByGroup);

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
 *                 group_id:
 *                   type: integer
 *                 opens:
 *                   type: string
 *                   format: date-time
 *                 due:
 *                   type: string
 *                   format: date-time
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
router.put('/satTests/:id', [verifyToken, verifyIsAdmin], satTestController.updateSatTest);

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
router.delete('/satTests/:id', [verifyToken, verifyIsAdmin], satTestController.deleteSatTest);

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
 *                     $ref: '#/components/schemas/SatAnswer'
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
