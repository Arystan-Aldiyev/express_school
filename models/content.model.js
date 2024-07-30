module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Content', {
        content_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        topic_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'topics',
                key: 'topic_id'
            },
            onDelete: 'CASCADE'
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        resource: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_done'
        }
    }, {
        tableName: 'contents',
        timestamps: false
    });
};
