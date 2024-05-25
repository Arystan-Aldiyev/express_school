const express = require('express');
const router = express.Router();
const { verifyToken, verifyIsAdmin, verifyIsTeacher, verifyIsGroupMember, verifyIsStudent } = require('../middleware/authJwt');
const testController = require('../controllers/test.controller');

router.get('/tests', [verifyToken, verifyIsAdmin || verifyIsTeacher], testController.findAllTest);
router.get('/tests/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], testController.findOneTest);
router.post('/tests', [verifyToken, verifyIsAdmin || verifyIsTeacher], testController.createTest);
router.put('/tests/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], testController.updateTest);
router.delete('/tests/:id', [verifyToken, verifyIsAdmin || verifyIsTeacher], testController.deleteTest);

module.exports = router;