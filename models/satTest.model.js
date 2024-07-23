module.exports = (sequelize, DataTypes) => {
    const SatTest = sequelize.define('SatTest', {
        sat_test_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        opens: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        due: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'sat_tests',
        timestamps: true,
    });

    SatTest.associate = models => {
        SatTest.hasMany(models.SatQuestion, {foreignKey: 'test_id', as: 'sat_questions'});
        SatTest.hasMany(models.SatAttempt, {foreignKey: 'test_id', as: 'sat_attempts'});
    };

    return SatTest;
};
