const express = require('express');
const router = express.Router();
const {
    verifyToken,
    verifyIsAdmin,
    verifyIsTeacher,
    verifyIsGroupMember,
    allowTeacherOrAdminOrGroupMember
} = require('../middleware/authJwt');
const groupController = require('../controllers/group.controller');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 *
 * /api/groups:
 *   get:
 *     summary: Retrieve a list of all groups
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
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
 *               teacher_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Invalid teacher ID or invite code generation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 *
 * /api/groups/{id}:
 *   get:
 *     summary: Retrieve details of a specific group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group id
 *     responses:
 *       200:
 *         description: Group details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Group not found
 *
 *   put:
 *     summary: Update a specific group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               teacher_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       400:
 *         description: Invalid teacher ID or error updating group
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete a specific group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group id
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal Server Error
 */

// Retrieve a list of all groups
router.get(
    "/groups",
    [verifyToken, verifyIsAdmin || verifyIsTeacher],
    groupController.getAllGroups
);

// Retrieve details of a specific group
router.get("/groups/:id", verifyToken, allowTeacherOrAdminOrGroupMember, groupController.getGroupById);


// Create a new group
router.post(
    "/groups",
    [verifyToken, verifyIsAdmin || verifyIsTeacher],
    groupController.createGroup
);

// Update a specific group
router.put(
    "/groups/:id",
    [verifyToken, verifyIsAdmin || verifyIsTeacher],
    groupController.updateGroup
);

// Delete a specific group
router.delete(
    "/groups/:id",
    [verifyToken, verifyIsAdmin || verifyIsTeacher],
    groupController.deleteGroup
);

module.exports = router;
