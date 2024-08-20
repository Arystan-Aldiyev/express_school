const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lesson.controller');
const {verifyToken, verifyIsAdmin, verifyIsTeacher, isAdminOrTeacher} = require('../middleware/authJwt');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Lesson:
 *       type: object
 *       required:
 *         - group_id
 *         - subject
 *         - section_title
 *       properties:
 *         lesson_id:
 *           type: integer
 *         group_id:
 *           type: integer
 *         subject:
 *           type: string
 *         section_title:
 *           type: string
 *       example:
 *         lesson_id: 1
 *         group_id: 2
 *         subject: "Math"
 *         section_title: "Introduction to Math"
 *
 * security:
 *   - bearerAuth: []
 *
 * tags:
 *   name: Lessons
 *   description: API for managing lessons
 */

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       201:
 *         description: Lesson created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 */
router.post('/lessons', [verifyToken, isAdminOrTeacher], lessonController.createLesson);

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Retrieve a list of lessons
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
router.get('/lessons', [verifyToken], lessonController.getLessons);

/**
 * @swagger
 * /api/lessons/{lesson_id}:
 *   get:
 *     summary: Retrieve a single lesson by ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lesson_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The lesson ID
 *     responses:
 *       200:
 *         description: A single lesson
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 */
router.get('/lessons/:lesson_id', [verifyToken], lessonController.getLessonById);

/**
 * @swagger
 * /api/lessons/group/{group_id}:
 *   get:
 *     summary: Retrieve lessons by group ID
 *     tags: [Lessons]
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
 *         description: A list of lessons for the group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: No lessons found for this group
 */
router.get('/lessons/group/:group_id', [verifyToken], lessonController.getLessonsByGroupId);

/**
 * @swagger
 * /api/lessons/subject/{subject}:
 *   get:
 *     summary: Retrieve lessons by subject
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subject
 *         schema:
 *           type: string
 *         required: true
 *         description: The lesson subject to retrieve
 *     responses:
 *       200:
 *         description: A list of lessons with the specified subject
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lessons not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lessons not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while retrieving the lessons
 */
router.get('/lessons/subject/:subject', [verifyToken], lessonController.getLessonsBySubject);

/**
 * @swagger
 * /api/lessons/{lesson_id}:
 *   put:
 *     summary: Update a lesson by ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lesson_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The lesson ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 *       409:
 *         description: Subject with that name already exists
 */
router.put('/lessons/:lesson_id', [verifyToken, isAdminOrTeacher], lessonController.updateLesson);

/**
 * @swagger
 * /api/lessons/{lesson_id}:
 *   delete:
 *     summary: Delete a lesson by ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lesson_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The lesson ID
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       404:
 *         description: Lesson not found
 */
router.delete('/lessons/:lesson_id', [verifyToken, isAdminOrTeacher], lessonController.deleteLesson);

module.exports = router;
