const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyIsAdmin, verifyIsStudent, verifyToken, verifyIsTeacher, isAdminOrOwner } = require('../middleware/authJwt');

// Create a new user (accessible by admin)
router.post('/', [verifyToken, verifyIsAdmin], userController.createUser);

// Retrieve all users (accessible by admin and teacher)
router.get('/', [verifyToken, verifyIsAdmin], userController.getAllUsers);

// Retrieve a single user by ID (accessible by admin and teacher)
router.get('/:id', [verifyToken], userController.getUserById);

// Update a user by ID (accessible by admin)
router.put('/:id', [verifyToken, isAdminOrOwner], userController.updateUser);

// Delete a user by ID (accessible by admin)
router.delete('/:id', [verifyToken, verifyIsAdmin], userController.deleteUser);

module.exports = router;
