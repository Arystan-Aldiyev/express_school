module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Question', {
      question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      test_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'tests',
          key: 'test_id'
        }
      },
      question_text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      hint: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      tableName: 'questions',
      timestamps: false
    });
  };