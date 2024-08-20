module.exports = (sequelize, DataTypes) => {
    return sequelize.define('AnswerOption', {
        option_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        question_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'questions',
                key: 'question_id'
            },
            onDelete: 'CASCADE'
        },
        option_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_correct: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'answer_options',
        timestamps: false
    });
};
  