const Sequelize = require('sequelize');
const config = require('../config/db.config.js');


const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.DIALECT,
        port: config.port,
        ssl: config.ssl,
        dialectOptions: config.dialectOptions,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        },
        logging: console.log,
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.user = require('./user.model.js')(sequelize, Sequelize);
db.group = require('./group.model.js')(sequelize, Sequelize);
db.groupMembership = require('./groupMembership.model.js')(sequelize, Sequelize);
db.test = require('./test.model.js')(sequelize, Sequelize);
db.question = require('./question.model.js')(sequelize, Sequelize);
db.answerOption = require('./answerOption.model.js')(sequelize, Sequelize);
db.attempt = require('./attempt.model.js')(sequelize, Sequelize);
db.answer = require('./answer.model.js')(sequelize, Sequelize);
db.notification = require('./notification.model.js')(sequelize, Sequelize);
db.post = require('./post.model.js')(sequelize, Sequelize);
db.message = require('./message.model.js')(sequelize, Sequelize);
db.dashboardAnnouncement = require('./dashboardAnnouncement.model.js')(sequelize, Sequelize);
db.dashboardCountdown = require('./dashboardCountdown.model.js')(sequelize, Sequelize);
db.calendar = require('./calendar.model.js')(sequelize, Sequelize);
db.lesson = require('./lesson.model')(sequelize, Sequelize);
db.topic = require('./topic.model')(sequelize, Sequelize);
db.content = require('./content.model')(sequelize, Sequelize);
db.satTest = require('./satTest.model')(sequelize, Sequelize);
db.satQuestion = require('./satQuestion.model')(sequelize, Sequelize);
db.satAnswerOption = require('./satAnswerOption.model')(sequelize, Sequelize);
db.satAnswer = require('./satAnswer.model')(sequelize, Sequelize);
db.satAttempt = require('./satAttempt.model')(sequelize, Sequelize);
db.suspendTestAnswer = require('./suspendTest.model')(sequelize, Sequelize)
db.studentContent = require('./MarkAsDoneContent')(sequelize, Sequelize)
db.satTestDeadline = require('./satTestDeadline.model')(sequelize, Sequelize);
db.questionMark = require('./markQuestions.model')(sequelize, Sequelize);
db.satQuestionMark = require('./markSatQuestions.model')(sequelize, Sequelize);
db.markSupsendQuestion = require('./markSuspendQuestion')(sequelize, Sequelize)

// Define associations
db.group.belongsTo(db.user, {foreignKey: 'teacher_id', as: 'teacher', onDelete: 'SET NULL'});
db.user.hasMany(db.group, {foreignKey: 'teacher_id', as: 'groups'});

db.lesson.hasMany(db.topic, {foreignKey: 'lesson_id', onDelete: 'CASCADE'});
db.topic.belongsTo(db.lesson, {foreignKey: 'lesson_id'});

db.topic.hasMany(db.content, {foreignKey: 'topic_id', onDelete: 'CASCADE'});
db.content.belongsTo(db.topic, {foreignKey: 'topic_id'});

db.groupMembership.belongsTo(db.group, {foreignKey: 'group_id', onDelete: 'CASCADE'});
db.groupMembership.belongsTo(db.user, {foreignKey: 'user_id', onDelete: 'CASCADE'});
db.group.hasMany(db.groupMembership, {foreignKey: 'group_id', onDelete: 'CASCADE'});
db.user.hasMany(db.groupMembership, {foreignKey: 'user_id', onDelete: 'CASCADE'});

db.test.belongsTo(db.group, {foreignKey: 'group_id', onDelete: 'CASCADE'});
db.group.hasMany(db.test, {foreignKey: 'group_id', onDelete: 'CASCADE'});

db.question.belongsTo(db.test, {foreignKey: 'test_id', as: 'Test', onDelete: 'CASCADE'});
db.test.hasMany(db.question, {foreignKey: 'test_id', as: 'questions', onDelete: 'CASCADE'});

db.question.hasMany(db.questionMark, {foreignKey: 'question_id', as: 'markQuestions', onDelete: 'CASCADE'})
db.questionMark.belongsTo(db.question, {foreignKey: 'question_id', as: 'question', onDelete: 'CASCADE'});


db.answerOption.belongsTo(db.question, {foreignKey: 'question_id', as: 'Question', onDelete: 'CASCADE'});
db.question.hasMany(db.answerOption, {foreignKey: 'question_id', as: 'answerOptions', onDelete: 'CASCADE'});

db.attempt.hasMany(db.answer, {foreignKey: 'attempt_id', onDelete: 'CASCADE'});
db.answer.belongsTo(db.attempt, {foreignKey: 'attempt_id', onDelete: 'CASCADE'});

db.attempt.belongsTo(db.test, {foreignKey: 'test_id', onDelete: 'CASCADE'});
db.test.hasMany(db.attempt, {foreignKey: 'test_id', onDelete: 'CASCADE'});
db.attempt.belongsTo(db.user, {foreignKey: 'user_id', onDelete: 'CASCADE'});
db.user.hasMany(db.attempt, {foreignKey: 'user_id', onDelete: 'CASCADE'});

db.answer.belongsTo(db.question, {foreignKey: 'question_id', as: 'Question', onDelete: 'CASCADE'});
db.answer.belongsTo(db.user, {foreignKey: 'user_id', onDelete: 'CASCADE'});
db.question.hasMany(db.answer, {foreignKey: 'question_id', as: 'Answers', onDelete: 'CASCADE'});
db.user.hasMany(db.answer, {foreignKey: 'user_id', onDelete: 'CASCADE'});

db.notification.belongsTo(db.user, {as: 'sender', foreignKey: 'sender_id', onDelete: 'SET NULL'});
db.user.hasMany(db.notification, {as: 'sentNotifications', foreignKey: 'sender_id', onDelete: 'SET NULL'});
db.notification.belongsTo(db.group, {as: 'group', foreignKey: 'group_id', onDelete: 'CASCADE'});
db.group.hasMany(db.notification, {as: 'notifications', foreignKey: 'group_id', onDelete: 'CASCADE'})

db.post.belongsTo(db.group, {foreignKey: 'group_id', onDelete: 'CASCADE'});
db.post.belongsTo(db.user, {foreignKey: 'author_id', onDelete: 'CASCADE'});
db.group.hasMany(db.post, {foreignKey: 'group_id', onDelete: 'CASCADE'});
db.user.hasMany(db.post, {foreignKey: 'author_id', onDelete: 'CASCADE'});

db.message.belongsTo(db.user, {foreignKey: 'user_id', onDelete: 'SET NULL'});
db.message.belongsTo(db.user, {foreignKey: 'sender_id', onDelete: 'SET NULL'});
db.user.hasMany(db.message, {as: 'sentMessages', foreignKey: 'sender_id', onDelete: 'SET NULL'});
db.user.hasMany(db.message, {as: 'receivedMessages', foreignKey: 'user_id', onDelete: 'SET NULL'});

db.dashboardAnnouncement.belongsTo(db.user, {foreignKey: 'author_id', onDelete: 'CASCADE'});
db.user.hasMany(db.dashboardAnnouncement, {foreignKey: 'author_id', onDelete: 'CASCADE'});

db.satTest.hasMany(db.satQuestion, {foreignKey: 'test_id', as: 'sat_questions', onDelete: 'CASCADE'});
db.satQuestion.belongsTo(db.satTest, {foreignKey: 'test_id', as: 'sat_test', onDelete: 'CASCADE'});
db.satTest.hasMany(db.satTestDeadline, {
    foreignKey: 'test_id',
    as: 'sat_test_deadlines',
    onDelete: 'CASCADE'
});

db.satQuestion.hasMany(db.satQuestionMark, {
    foreignKey: 'sat_question_id',
    as: 'mark_sat_questions',
    onDelete: 'CASCADE'
});
db.satQuestionMark.belongsTo(db.satQuestion, {
    foreignKey: 'sat_question_id',
    as: 'sat_question',
    onDelete: 'CASCADE'
});

db.satTestDeadline.belongsTo(db.satTest, {
    foreignKey: 'test_id',
    as: 'sat_test',
    onDelete: 'CASCADE'
});


db.satQuestion.hasMany(db.satAnswerOption, {foreignKey: 'question_id', as: 'sat_answer_options', onDelete: 'CASCADE'});
db.satAnswerOption.belongsTo(db.satQuestion, {foreignKey: 'question_id', as: 'sat_question', onDelete: 'CASCADE'});

db.satAttempt.hasMany(db.satAnswer, {foreignKey: 'sat_attempt_id', as: 'sat_answers', onDelete: 'CASCADE'});
db.satAnswer.belongsTo(db.satAttempt, {foreignKey: 'sat_attempt_id', as: 'sat_attempt', onDelete: 'CASCADE'});

db.satAnswer.belongsTo(db.satQuestion, {foreignKey: 'sat_question_id', as: 'sat_question', onDelete: 'CASCADE'});
db.satQuestion.hasMany(db.satAnswer, {foreignKey: 'sat_question_id', as: 'sat_answers', onDelete: 'CASCADE'});

db.satAttempt.belongsTo(db.satTest, {foreignKey: 'test_id', as: 'sat_test', onDelete: 'CASCADE'});
db.satTest.hasMany(db.satAttempt, {foreignKey: 'test_id', as: 'sat_attempts', onDelete: 'CASCADE'});

db.satAttempt.belongsTo(db.user, {foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE'});
db.user.hasMany(db.satAttempt, {foreignKey: 'user_id', as: 'sat_attempts', onDelete: 'CASCADE'});

db.suspendTestAnswer.belongsTo(db.test, {foreignKey: 'test_id', as: 'Test', onDelete: 'CASCADE'});
db.test.hasMany(db.suspendTestAnswer, {foreignKey: 'test_id', as: 'SuspendTestAnswers', onDelete: 'CASCADE'});

db.suspendTestAnswer.belongsTo(db.question, {foreignKey: 'question_id', as: 'Question', onDelete: 'CASCADE'});
db.question.hasMany(db.suspendTestAnswer, {foreignKey: 'question_id', as: 'suspendTestAnswers', onDelete: 'CASCADE'});

db.suspendTestAnswer.belongsTo(db.user, {foreignKey: 'user_id', as: 'User', onDelete: 'CASCADE'});
db.user.hasMany(db.suspendTestAnswer, {foreignKey: 'user_id', as: 'SuspendTestAnswers', onDelete: 'CASCADE'});


module.exports = db;