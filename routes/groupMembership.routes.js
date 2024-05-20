const express = require('express');
const router = express.Router();
const { verifyToken, verifyIsAdmin, verifyIsTeacher, verifyIsGroupMember, verifyIsStudent } = require('../middleware/authJwt');
const membershipController = require('../controllers/groupMembership.controller');

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
 *       404:
 *         description: Group not found
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
 *       404:
 *         description: Group or user not found
 *       500:
 *         description: Internal Server Error
 * 
 * /api/groups/join:
 *   post:
 *     summary: Join a group by invite code
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invite_code:
 *                 type: string
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Member added to the group
 *       400:
 *         description: User already a member of the group
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Invalid invite code or user not found
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
 *         description: Group or membership not found
 *       500:
 *         description: Internal Server Error
 */

// Retrieve memberships in a specific group
router.get(
  "/groups/:id/memberships",
  [verifyToken, verifyIsAdmin || verifyIsTeacher || verifyIsGroupMember],
  membershipController.getGroupMemberships
);

// Add a member to a group
router.post(
  "/groups/:id/memberships",
  [verifyToken, verifyIsAdmin || verifyIsTeacher],
  membershipController.addGroupMember
);

// Add a member to a group by invite code
router.post(
  "/groups/join",
  [verifyToken, verifyIsAdmin || verifyIsStudent || verifyIsTeacher],
  membershipController.joinGroupByInviteCode
);

// Remove a member from a group
router.delete(
  "/groups/:id/memberships/:membership_id",
  [verifyToken, verifyIsAdmin || verifyIsTeacher],
  membershipController.removeGroupMember
);

module.exports = router;
