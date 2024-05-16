module.exports = {
    HOST: "dpg-cp2ta4i1hbls7384hjf0-a.frankfurt-postgres.render.com",
    USER: "express_school_db_user",
    PASSWORD: "5TfZRQ3mKJ1ZXk0gcbAAzsSeHa30HDpi",
    DB: "express_school_db",
    port: 5432,
    ssl: {
        require: true,
        rejectUnauthorized: false, // Change to true in production with a valid CA certificate
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
