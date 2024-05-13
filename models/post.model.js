module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Post', {
      post_id: {
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
      author_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'posts',
      timestamps: false
    });
  };
  