module.exports = (sequelize, DataTypes) => {
    const SatQuestion = sequelize.define('SatQuestion', {
        sat_question_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        question_text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        section: {
            type: DataTypes.STRING,
            allowNull: false, // 'math', 'verbal'
        },
        hint: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        explanation: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        explanation_image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        test_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'sat_tests',
                key: 'sat_test_id',
            },
            onDelete: 'CASCADE'
        },
        question_type: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'single' // 'single' for one correct answer, 'multiple' for multiple correct answers
        }
    }, {
        tableName: 'sat_questions',
        timestamps: true,
    });

    SatQuestion.associate = models => {
        SatQuestion.belongsTo(models.SatTest, {foreignKey: 'test_id', as: 'sat_test', onDelete: 'CASCADE'});
        SatQuestion.hasMany(models.SatAnswerOption, {
            foreignKey: 'question_id',
            as: 'sat_answer_options',
            onDelete: 'CASCADE'
        });
        SatQuestion.hasMany(models.SatAnswer, {foreignKey: 'sat_question_id', as: 'sat_answers', onDelete: 'CASCADE'});
    };

    return SatQuestion;
};