const {Pool} = require('pg');
const pool = new Pool({

    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    database: 'postgres',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};