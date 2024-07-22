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
            }
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
        }
    }, {
        tableName: 'contents',
        timestamps: false
    });
};
