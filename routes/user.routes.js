const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyIsAdmin, verifyToken, isAdminOrOwner } = require('../middleware/authJwt');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *         - phone_number
 *       properties:
 *         user_id:
 *           type: integer
 *           readOnly: true
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [teacher, student, admin]
 *         phone_number:
 *           type: string
 *     UpdateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [teacher, student, admin]
 *         phone_number:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - bearerAuth: []
 */

/**
* @swagger
* components:
*  schemas:
*    UserWithGroup:
*      type: object
*      properties:
*        user:
*          $ref: '#/components/schemas/User'
*        group_id:
*          type: integer
*          description: The ID of the group the user belongs to
*
 */

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Retrieve all users (Admin only)
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithGroup'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update a user by ID (Admin or the user themselves)
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a user by ID (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

// Create a new user (accessible by admin)
router.post('/', [verifyToken, verifyIsAdmin], userController.createUser);

// Retrieve all users (accessible by admin)
router.get('/', [verifyToken, verifyIsAdmin], userController.getAllUsers);

// Retrieve a single user by ID (accessible by admin)
router.get('/:id', [verifyToken], userController.getUserById);

// Update a user by ID (accessible by admin or the user themselves)
router.put('/:id', [verifyToken, isAdminOrOwner], userController.updateUser);

// Delete a user by ID (accessible by admin)
router.delete('/:id', [verifyToken, verifyIsAdmin], userController.deleteUser);

module.exports = router;
