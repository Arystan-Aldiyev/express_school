const express = require('express');
const router = express.Router();
const { verifyToken, verifyIsAdmin, verifyIsTeacher } = require('../middleware/authJwt');
const testController = require('../controllers/test.controller');

/**
 * @swagger
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
router.get('/tests', [verifyToken, verifyIsAdmin || verifyIsTeacher], testController.findAllTest);

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
router.get('/tests/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], testController.findOneTest);

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

module.exports = router;
