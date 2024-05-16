const {Pool} = require('pg');
const dbConfig = require('./config/db.config');
const pool = new Pool({

    user: dbConfig.USER,
    host: dbConfig.HOST,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    port: 5432,
    ssl: dbConfig.ssl,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};