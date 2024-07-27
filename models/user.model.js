module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('teacher', 'student', 'admin'),
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'users',
        timestamps: false
    });

    User.associate = (models) => {
        User.hasMany(models.SuspendTestAnswer, {foreignKey: 'user_id', as: 'suspendTestAnswers'});
    };

    return User;
};
