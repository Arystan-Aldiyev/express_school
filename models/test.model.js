module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define('Test', {
        test_id: {
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
        Test.hasMany(models.Question, {foreignKey: 'test_id', as: 'questions'});
        Test.hasMany(models.Attempt, {foreignKey: 'test_id'});
    };
    return Test;
};