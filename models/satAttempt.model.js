module.exports = (sequelize, DataTypes) => {
    const SatAttempt = sequelize.define('SatAttempt', {
        sat_attempt_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        extend_time_math: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        extend_time_verbal: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        extend_time_break: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'in_progress',
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id',
            },
        },
        test_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'sat_tests',
                key: 'sat_test_id',
            },
        },
        verbal_score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sat_score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        total_score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'sat_attempts',
        timestamps: true,
    });

    SatAttempt.associate = models => {
        SatAttempt.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
        SatAttempt.belongsTo(models.SatTest, {foreignKey: 'test_id', as: 'sat_test'});
        SatAttempt.hasMany(models.SatAnswer, {foreignKey: 'sat_attempt_id', as: 'sat_answers'});
    };

    return SatAttempt;
};
