module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
        question_id: {
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
        question_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        hint: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        explanation: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        explanation_image: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'questions',
        timestamps: false
    });
    Question.associate = (models) => {
        Question.belongsTo(models.Test, {foreignKey: 'test_id', as: 'Test'});
        Question.hasMany(models.Answer, {foreignKey: 'question_id', as: 'Answers'});
        Question.hasMany(models.SuspendTestAnswer, {foreignKey: 'question_id', as: 'SuspendTestAnswers'});
    };

    return Question;
};