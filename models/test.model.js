module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define('Test', {
        test_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        group_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'groups',
                key: 'group_id'
            },
            onDelete: 'CASCADE'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        time_open: {
            type: DataTypes.DATE
        },
        duration_minutes: {
            type: DataTypes.INTEGER
        },
        max_attempts: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'tests',
        timestamps: false
    });

    Test.associate = (models) => {
        Test.hasMany(models.Question, {foreignKey: 'test_id', as: 'questions', onDelete: 'CASCADE'});
        Test.hasMany(models.Attempt, {foreignKey: 'test_id', onDelete: 'CASCADE'});
        Test.hasMany(models.SuspendTestAnswer, {foreignKey: 'test_id', as: 'suspendTestAnswers', onDelete: 'CASCADE'});
    };

    return Test;
};