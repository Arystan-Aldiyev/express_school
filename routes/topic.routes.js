const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topic.controller');
const { verifyToken, verifyIsAdmin, verifyIsTeacher } = require('../middleware/authJwt');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Topic:
 *       type: object
 *       required:
 *         - lesson_id
 *         - title
 *       properties:
 *         topic_id:
 *           type: integer
 *         lesson_id:
 *           type: integer
 *         title:
 *           type: string
 *       example:
 *         topic_id: 1
 *         lesson_id: 2
 *         title: "Introduction to Algebra"
 */

/**
 * @swagger
 * /api/topics:
 *   post:
 *     summary: Create a new topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Topic'
 *     responses:
 *       201:
 *         description: Topic created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 */
router.post('/topics', [verifyToken, verifyIsAdmin || verifyIsTeacher], topicController.createTopic);

/**
 * @swagger
 * /api/topics:
 *   get:
 *     summary: Retrieve a list of topics
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of topics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 */
router.get('/topics', [verifyToken], topicController.getTopics);

/**
 * @swagger
 * /api/topics/{topic_id}:
 *   get:
 *     summary: Retrieve a single topic by ID
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The topic ID
 *     responses:
 *       200:
 *         description: A single topic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       404:
 *         description: Topic not found
 */
router.get('/topics/:topic_id', [verifyToken], topicController.getTopicById);

/**
 * @swagger
 * /api/topics/lesson/{lesson_id}:
 *   get:
 *     summary: Retrieve topics by lesson ID
 *     tags: [Topics]
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
 *         description: A list of topics for the lesson
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 *       404:
 *         description: No topics found for this lesson
 */
router.get('/topics/lesson/:lesson_id', [verifyToken], topicController.getTopicsByLessonId);

/**
 * @swagger
 * /api/topics/{topic_id}:
 *   put:
 *     summary: Update a topic by ID
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The topic ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Topic'
 *     responses:
 *       200:
 *         description: Topic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       404:
 *         description: Topic not found
 */
router.put('/topics/:topic_id', [verifyToken, verifyIsAdmin || verifyIsTeacher], topicController.updateTopic);

/**
 * @swagger
 * /api/topics/{topic_id}:
 *   delete:
 *     summary: Delete a topic by ID
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The topic ID
 *     responses:
 *       204:
 *         description: Topic deleted successfully
 *       404:
 *         description: Topic not found
 */
router.delete('/topics/:topic_id', [verifyToken, verifyIsAdmin || verifyIsTeacher], topicController.deleteTopic);

module.exports = router;
