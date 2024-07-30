const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const {verifyToken, verifyIsAdmin, verifyIsTeacher} = require('../middleware/authJwt');
const {upload} = require("../services/amazon.s3.service");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Content:
 *       type: object
 *       required:
 *         - topic_id
 *         - title
 *         - mode
 *         - resource
 *       properties:
 *         content_id:
 *           type: integer
 *         topic_id:
 *           type: integer
 *         title:
 *           type: string
 *         mode:
 *           type: string
 *         resource:
 *           type: string
 *         isDone:
 *           type: boolean
 *       example:
 *         content_id: 1
 *         topic_id: 2
 *         title: "Introduction to Algebra"
 *         mode: "text"
 *         resource: "This is the content text"
 *         isDone: false
 */

/**
 * @swagger
 * /api/contents:
 *   post:
 *     summary: Create a new content with text mode
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Content'
 *     responses:
 *       201:
 *         description: Content created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 */
router.post('/contents', [verifyToken, verifyIsAdmin || verifyIsTeacher], contentController.createContentWithText);

/**
 * @swagger
 * /api/contents/file:
 *   post:
 *     summary: Create a new content with file mode
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               topic_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Content created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 */
router.post('/contents/file', [verifyToken, verifyIsAdmin || verifyIsTeacher], upload.single('file'), contentController.createContentWithFile);

/**
 * @swagger
 * /api/contents/video:
 *   post:
 *     summary: Create a new content with video mode
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               topic_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Content created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 */
router.post('/contents/video', [verifyToken, verifyIsAdmin || verifyIsTeacher], upload.single('file'), contentController.createContentWithVideo);

/**
 * @swagger
 * /api/contents:
 *   get:
 *     summary: Retrieve a list of contents
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of contents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 */
router.get('/contents', [verifyToken], contentController.getContents);

/**
 * @swagger
 * /api/contents/{content_id}:
 *   get:
 *     summary: Retrieve a single content by ID
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: content_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The content ID
 *     responses:
 *       200:
 *         description: A single content with user status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 */
router.get('/contents/:content_id', [verifyToken], contentController.getContentById);

/**
 * @swagger
 * /api/contents/topic/{topic_id}:
 *   get:
 *     summary: Retrieve contents by topic ID
 *     tags: [Contents]
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
 *         description: A list of contents with user status for the topic
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 *       404:
 *         description: No contents found for this topic
 */
router.get('/contents/topic/:topic_id', [verifyToken], contentController.getContentsByTopicId);

/**
 * @swagger
 * /api/contents/{content_id}/mark-as-done:
 *   patch:
 *     summary: Mark content as done
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: content_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The content ID
 *     responses:
 *       200:
 *         description: Content marked as done
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 */
router.patch('/contents/:content_id/mark-as-done', [verifyToken], contentController.markContentAsDone);

/**
 * @swagger
 * /api/contents/{content_id}/unmark-as-done:
 *   patch:
 *     summary: Unmark content as done
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: content_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The content ID
 *     responses:
 *       200:
 *         description: Content unmarked as done
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 */
router.patch('/contents/:content_id/unmark-as-done', [verifyToken], contentController.unmarkContentAsDone);

/**
 * @swagger
 * /api/contents/{content_id}:
 *   delete:
 *     summary: Delete a content by ID
 *     tags: [Contents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: content_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The content ID
 *     responses:
 *       204:
 *         description: Content deleted successfully
 *       404:
 *         description: Content not found
 */
router.delete('/contents/:content_id', [verifyToken, verifyIsAdmin || verifyIsTeacher], contentController.deleteContent);


module.exports = router;