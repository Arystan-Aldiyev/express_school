module.exports = (sequelize, DataTypes) => {
    const SatTest = sequelize.define('SatTest', {
        sat_test_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        tableName: 'sat_tests',
        timestamps: true,
    });

    SatTest.associate = models => {
        SatTest.hasMany(models.SatTestDeadline, {
            foreignKey: 'test_id',
            as: 'sat_test_deadlines',
            onDelete: 'CASCADE'
        });
        SatTest.hasMany(models.SatQuestion, {foreignKey: 'test_id', as: 'sat_questions'});
        SatTest.hasMany(models.SatAttempt, {foreignKey: 'test_id', as: 'sat_attempts'});
    };

    return SatTest;
};
