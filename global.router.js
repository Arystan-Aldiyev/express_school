const express = require('express');
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const userRoutes = require('./routes/user.routes');
const groupRoutes = require('./routes/group.routes');
const testRoutes = require('./routes/test.routes');
const groupMembershipRoutes = require('./routes/groupMembership.routes');
const questionRoutes = require('./routes/question.routes');
const answerOptionRoutes = require('./routes/answerOption.routes');
const attemptRoutes = require('./routes/attempt.routes');
const notificationRoutes = require('./routes/notification.routes');
const calendarRoutes = require('./routes/calendar.routes');
const lessonRoutes = require('./routes/lesson.routes');
const topicRoutes = require('./routes/topic.routes');
const contentRoutes = require('./routes/content.routes');
const satTestRoutes = require('./routes/satTest.routes');
const satQuestionRoutes = require('./routes/satQuestion.routes');
const satAnswerOptionRoutes = require('./routes/satAnswerOption.routes')
const satAttemptRoutes = require('./routes/satAttempt.routes')

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/user', userRoutes);
router.use('/', groupRoutes);
router.use('/', groupMembershipRoutes);
router.use('/', testRoutes);
router.use('/', questionRoutes);
router.use('/', answerOptionRoutes);
router.use('/', attemptRoutes);
router.use('/', notificationRoutes)
router.use('/', calendarRoutes)
router.use('/', lessonRoutes)
router.use('/', topicRoutes)
router.use('/', contentRoutes)
router.use('/', satTestRoutes)
router.use('/', satQuestionRoutes)
router.use('/', satAnswerOptionRoutes)
router.use('/', satAttemptRoutes)

module.exports = router;