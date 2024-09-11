module.exports = (sequelize, DataTypes) => {
    const SatTestDeadline = sequelize.define('SatTestDeadline', {
        deadline_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        open: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
            }
        },
        due: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
                isAfterOpen(value) {
                    if (new Date(value) <= new Date(this.open)) {
                        throw new Error('due must be after open');
                    }
                }
            }
        },
        test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'SatTest',
                key: 'sat_test_id',
            },
            onDelete: 'CASCADE',
        }
    }, {
        tableName: 'deadlines',
        timestamps: true,
    });

    SatTestDeadline.associate = models => {
        SatTestDeadline.belongsTo(models.SatTest, {foreignKey: 'test_id', as: 'sat_test'});
    };

    return SatTestDeadline;
};
