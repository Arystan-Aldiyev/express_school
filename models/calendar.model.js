// models/calendar.model.js
module.exports = (sequelize, DataTypes) => {
    const Calendar = sequelize.define('Calendar', {
        schedule_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        group_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'groups',
                key: 'group_id'
            },
            allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'calendars',
        timestamps: false
    });

    Calendar.associate = models => {
        Calendar.belongsTo(models.Group, {
            foreignKey: 'group_id',
            as: 'group'
        });
    };

    return Calendar;
};