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
            },
            onDelete: 'CASCADE'
        },
        question_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'questions',
                key: 'question_id'
            },
            onDelete: 'CASCADE'
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onDelete: 'CASCADE'
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
        SuspendTestAnswer.belongsTo(models.Test, {foreignKey: 'test_id', as: 'tests', onDelete: 'CASCADE'});
        SuspendTestAnswer.belongsTo(models.Question, {foreignKey: 'question_id', as: 'Question', onDelete: 'CASCADE'});
        SuspendTestAnswer.belongsTo(models.User, {foreignKey: 'user_id', as: 'users', onDelete: 'CASCADE'});
    };

    return SuspendTestAnswer;
};