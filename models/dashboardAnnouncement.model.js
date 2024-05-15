module.exports = (sequelize, Sequelize) => {
    const DashboardAnnouncement = sequelize.define("dashboard_announcement", {
        announcement_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        image: {
            type: Sequelize.BLOB("long")
        },
        link: {
            type: Sequelize.STRING
        },
        link_description: {
            type: Sequelize.TEXT
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        start_time: {
            type: Sequelize.DATE
        },
        end_time: {
            type: Sequelize.DATE
        },
        event_date: {
            type: Sequelize.DATE
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },
    {
        timestamps: false, 
        createdAt: 'created_at',
    } 


);

    return DashboardAnnouncement;
};