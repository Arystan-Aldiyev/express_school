module.exports = (sequelize, DataTypes) => {
    const Attempt = sequelize.define('Attempt', {
        attempt_id: {
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
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        start_time: {
            type: DataTypes.DATE
        },
        end_time: {
            type: DataTypes.DATE
        },
        score: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'attempts',
        timestamps: false
    });

    Attempt.associate = (models) => {
        Attempt.belongsTo(models.Test, {foreignKey: 'test_id', as: 'Test'});
        Attempt.hasMany(models.Answer, {foreignKey: 'attempt_id'});
        Attempt.belongsTo(models.User, {foreignKey: 'user_id'});
    };

    return Attempt;
};
  