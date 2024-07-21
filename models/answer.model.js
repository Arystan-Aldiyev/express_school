module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define('Answer', {
        answer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        attempt_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'attempts',
                key: 'attempt_id'
            }
        },
        submitted_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'answers',
        timestamps: false
    });
    Answer.associate = (models) => {
        Answer.belongsTo(models.Question, {foreignKey: 'question_id', as: 'Question'});
        Answer.belongsTo(models.User, {foreignKey: 'user_id'});
    };

    return Answer;
};
  