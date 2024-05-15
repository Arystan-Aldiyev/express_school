module.exports = (sequelize, Sequelize) => {
    const DashboardCountdown = sequelize.define("dashboard_countdown", {
        countdown_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        target_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    return DashboardCountdown;
};