const express = require('express');
const deadlineController = require('../controllers/satTestDeadline.controller');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Deadline:
 *       type: object
 *       required:
 *         - group_id
 *         - open
 *         - due
 *         - test_id
 *       properties:
 *         deadline_id:
 *           type: integer
 *         group_id:
 *           type: integer
 *         open:
 *           type: string
 *           format: date-time
 *         due:
 *           type: string
 *           format: date-time
 *         test_id:
 *           type: integer
 *       example:
 *         deadline_id: 1
 *         group_id: 1
 *         open: "2024-09-15T09:00:00Z"
 *         due: "2024-09-15T11:00:00Z"
 *         test_id: 1
 *
 * security:
 *   - bearerAuth: []
 *
 * tags:
 *   name: Deadlines
 *   description: API for managing deadlines associated with SAT Tests
 */

/**
 * @swagger
 * /api/satTests/deadlines:
 *   post:
 *     summary: Create a new deadline for a SAT test
 *     tags: [Deadlines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               test_id:
 *                 type: integer
 *                 description: The ID of the SAT test
 *                 example: 1
 *               group_id:
 *                 type: integer
 *                 description: The group ID
 *                 example: 1
 *               open:
 *                 type: string
 *                 format: date-time
 *                 description: Open date and time
 *                 example: "2024-09-15T09:00:00Z"
 *               due:
 *                 type: string
 *                 format: date-time
 *                 description: Due date and time
 *                 example: "2024-09-15T11:00:00Z"
 *     responses:
 *       201:
 *         description: Deadline created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deadline'
 *       500:
 *         description: Server error
 */
router.post('/satTests/deadlines', deadlineController.createDeadline);

/**
 * @swagger
 * /api/satTests/{testId}/deadlines:
 *   get:
 *     summary: Retrieve all deadlines for a specific SAT test
 *     tags: [Deadlines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: testId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the SAT test
 *     responses:
 *       200:
 *         description: A list of deadlines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Deadline'
 *       500:
 *         description: Server error
 */
router.get('/satTests/:testId/deadlines', deadlineController.getDeadlinesByTest);

/**
 * @swagger
 * /api/deadlines/{id}:
 *   put:
 *     summary: Update a specific deadline
 *     tags: [Deadlines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the deadline
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deadline'
 *     responses:
 *       200:
 *         description: Deadline updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deadline'
 *       500:
 *         description: Server error
 */
router.put('/deadlines/:id', deadlineController.updateDeadline);

/**
 * @swagger
 * /api/deadlines/{id}:
 *   delete:
 *     summary: Delete a specific deadline
 *     tags: [Deadlines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the deadline
 *     responses:
 *       200:
 *         description: Deadline deleted successfully
 *       404:
 *         description: Deadline not found
 *       500:
 *         description: Server error
 */
router.delete('/deadlines/:id', deadlineController.deleteDeadline);

module.exports = router;
