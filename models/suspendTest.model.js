module.exports = (sequelize, DataTypes) => {
    const SuspendTestAnswer = sequelize.define('SuspendTestAnswer', {
        suspend_test_answer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        test_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tests',
                key: 'test_id'
            }
        },
        question_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'questions',
                key: 'question_id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        student_answer: {
            type: DataTypes.STRING
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        suspend_time: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'suspend_test_answers',
        timestamps: false
    });

    SuspendTestAnswer.associate = (models) => {
        SuspendTestAnswer.belongsTo(models.Test, {foreignKey: 'test_id', as: 'tests'});
        SuspendTestAnswer.belongsTo(models.Question, {foreignKey: 'question_id', as: 'Question'});
        SuspendTestAnswer.belongsTo(models.User, {foreignKey: 'user_id', as: 'users'});
    };

    return SuspendTestAnswer;
};
