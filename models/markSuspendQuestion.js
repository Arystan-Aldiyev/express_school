module.exports = (sequelize, DataTypes) => {
    return sequelize.define('MarkSuspendQuestion', {
        mark_suspend_question_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        test_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tests',
                key: 'test_id'
            },
            onDelete: 'CASCADE'
        },
        is_marked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'mark_suspend_questions',
        timestamps: false,
        underscored: true
    });
};
