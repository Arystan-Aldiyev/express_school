module.exports = (sequelize, DataTypes) => {
    return sequelize.define('StudentContent', {
        studentContentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'student_content_id'
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
        contentId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'contents',
                key: 'content_id'
            },
            onDelete: 'CASCADE',
            field: 'content_id'
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_done'
        }
    }, {
        tableName: 'student_contents',
        timestamps: false,
        underscored: true
    });
};