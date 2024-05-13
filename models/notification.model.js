module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Notification', {
      notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      student_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      tableName: 'notifications',
      timestamps: false
    });
  };
  