module.exports = (sequelize, DataTypes) => {
    return sequelize.define('MarkSatQuestions', {
        mark_question_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onDelete: 'CASCADE'
        },
        sat_question_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'sat_questions',
                key: 'sat_question_id'
            }
        },
        sat_attempt_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'sat_attempts',
                key: 'sat_attempt_id'
            }
        },
        is_mark: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        tableName: 'mark_sat_questions',
        timestamps: false,
        underscored: true
    });
};