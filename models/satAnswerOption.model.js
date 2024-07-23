module.exports = (sequelize, DataTypes) => {
    const SatAnswerOption = sequelize.define('SatAnswerOption', {
        sat_answer_option_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_correct: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        question_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'sat_questions',
                key: 'sat_question_id',
            },
        },
    }, {
        tableName: 'sat_answer_options',
        timestamps: true,
    });

    SatAnswerOption.associate = models => {
        SatAnswerOption.belongsTo(models.SatQuestion, {foreignKey: 'question_id', as: 'sat_question'});
    };

    return SatAnswerOption;
};
