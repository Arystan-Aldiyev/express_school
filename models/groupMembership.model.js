module.exports = (sequelize, DataTypes) => {
    return sequelize.define('GroupMembership', {
        membership_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        group_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'groups',
                key: 'group_id'
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
        joined: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        role: {
            type: DataTypes.ENUM('student', 'teacher', 'admin'),
            allowNull: false
        }
    }, {
        tableName: 'group_memberships',
        timestamps: false
    });
};
  