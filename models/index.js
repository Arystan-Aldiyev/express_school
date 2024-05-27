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
        }
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

// Define associations
db.group.belongsTo(db.user, { foreignKey: 'teacher_id', as: 'teacher' });
db.user.hasMany(db.group, { foreignKey: 'teacher_id', as: 'groups' });

db.groupMembership.belongsTo(db.group, { foreignKey: 'group_id' });
db.groupMembership.belongsTo(db.user, { foreignKey: 'user_id' });
db.group.hasMany(db.groupMembership, { foreignKey: 'group_id' });
db.user.hasMany(db.groupMembership, { foreignKey: 'user_id' });

db.test.belongsTo(db.group, { foreignKey: 'group_id' });
db.group.hasMany(db.test, { foreignKey: 'group_id' });

db.question.belongsTo(db.test, { foreignKey: 'test_id', as: 'test'});
db.test.hasMany(db.question, { foreignKey: 'test_id', as: 'questions'});

db.answerOption.belongsTo(db.question, { foreignKey: 'question_id', as: 'questions'});
db.question.hasMany(db.answerOption, { foreignKey: 'question_id', as: 'answerOptions'});

db.attempt.hasMany(db.answer, { foreignKey: 'attempt_id' });
db.answer.belongsTo(db.attempt, { foreignKey: 'attempt_id' });

db.attempt.belongsTo(db.test, { foreignKey: 'test_id' });
db.test.hasMany(db.attempt, { foreignKey: 'test_id' });
db.attempt.belongsTo(db.user, { foreignKey: 'user_id' });
db.user.hasMany(db.attempt, { foreignKey: 'user_id' });

db.answer.belongsTo(db.question, { foreignKey: 'question_id' });
db.answer.belongsTo(db.user, { foreignKey: 'user_id' });
db.question.hasMany(db.answer, { foreignKey: 'question_id' });
db.user.hasMany(db.answer, { foreignKey: 'user_id' });

db.notification.belongsTo(db.user, { foreignKey: 'user_id' });
db.user.hasMany(db.notification, { foreignKey: 'user_id' });

db.post.belongsTo(db.group, { foreignKey: 'group_id' });
db.post.belongsTo(db.user, { foreignKey: 'author_id' });
db.group.hasMany(db.post, { foreignKey: 'group_id' });
db.user.hasMany(db.post, { foreignKey: 'author_id' });

db.message.belongsTo(db.user, { foreignKey: 'user_id' });
db.message.belongsTo(db.user, { foreignKey: 'sender_id' });
db.user.hasMany(db.message, { as: 'sentMessages', foreignKey: 'sender_id' });
db.user.hasMany(db.message, { as: 'receivedMessages', foreignKey: 'user_id' });

db.dashboardAnnouncement.belongsTo(db.user, { foreignKey: 'author_id' });
db.user.hasMany(db.dashboardAnnouncement, { foreignKey: 'author_id' });

  

module.exports = db;
