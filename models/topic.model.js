module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Topic', {
        topic_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        lesson_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'lessons',
                key: 'lesson_id'
            },
            onDelete: 'CASCADE'
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'topics',
        timestamps: true
    });
};