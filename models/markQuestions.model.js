module.exports = (sequelize, DataTypes) => {
    return sequelize.define('MarkQuestions', {
        mark_question_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onDelete: 'CASCADE',
            field: 'user_id'
        },
        attemptId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'attempts',
                key: 'attempt_id',
            },
            onDelete: 'CASCADE',
            field: 'attempt_id'
        },
        questionId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'questions',
                key: 'question_id'
            }
        },
        is_mark: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'mark_questions',
        timestamps: false,
        underscored: true
    });
};