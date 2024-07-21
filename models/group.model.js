module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
        group_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        invite_code: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {
        tableName: 'groups',
        timestamps: false
    });

    Group.associate = models => {
        Group.hasMany(models.Schedule, {
            foreignKey: 'group_id',
            as: 'schedules'
        });
    };

    return Group;
};