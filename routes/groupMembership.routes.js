const express = require('express');
const router = express.Router();
const { verifyToken, verifyIsAdmin, verifyIsTeacher, verifyIsGroupMember } = require('../middleware/authJwt');
const groupMembershipController = require('../controllers/groupMembership.controller');
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
 * /api/groups/{id}/memberships:
 *   get:
 *     summary: Retrieve a list of memberships in a specific group
 *     tags: [Memberships]
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
 *         description: List of memberships in the group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membership'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 * 
 *   post:
 *     summary: Add a member to a group
 *     tags: [Memberships]
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
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Member added to the group
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 * 
 * /api/groups/{id}/memberships/{membership_id}:
 *   delete:
 *     summary: Remove a member from a group
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group id
 *       - in: path
 *         name: membership_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The membership id
 *     responses:
 *       200:
 *         description: Member removed from the group
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal Server Error
 */

// Retrieve memberships in a specific group
router.get(
  "/groups/:id/memberships",
  [verifyToken, verifyIsAdmin || verifyIsTeacher || verifyIsGroupMember],
  groupMembershipController.getGroupMemberships
);

// Add a member to a group
router.post(
  "/groups/:id/memberships",
  [verifyToken, verifyIsAdmin || verifyIsTeacher],
  groupMembershipController.addGroupMember
);

// Remove a member from a group
router.delete(
  "/groups/:id/memberships/:membership_id",
  [verifyToken, verifyIsAdmin || verifyIsTeacher],
  groupMembershipController.removeGroupMember
);

module.exports = router;
