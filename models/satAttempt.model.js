module.exports = (sequelize, DataTypes) => {
    const SatAttempt = sequelize.define('SatAttempt', {
        sat_attempt_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id',
            },
            onDelete: 'CASCADE'
        },
        test_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'sat_tests',
                key: 'sat_test_id',
            },
            onDelete: 'CASCADE'
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
        SatAttempt.belongsTo(models.User, {foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE'});
        SatAttempt.belongsTo(models.SatTest, {foreignKey: 'test_id', as: 'sat_test', onDelete: 'CASCADE'});
        SatAttempt.hasMany(models.SatAnswer, {foreignKey: 'sat_attempt_id', as: 'sat_answers', onDelete: 'CASCADE'});
    };

    return SatAttempt;
};
