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
      correct_answer: {
        type: DataTypes.STRING
      },
      hint: {
        type: DataTypes.TEXT
      }
    }, {
      tableName: 'questions',
      timestamps: false
    });
  };