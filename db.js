const {Pool} = require('pg');
const dbConfig = require('./config/db.config');
const pool = new Pool({

    user: dbConfig.USER,
    host: dbConfig.HOST,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    port: 5432,
    ssl: {
        require: true,
        rejectUnauthorized: false, // Change to true in production with a valid CA certificate
    },
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};