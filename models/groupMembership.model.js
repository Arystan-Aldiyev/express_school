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
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        }
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
  