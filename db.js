const {Pool} = require('pg');
const pool = new Pool({

    user: 'express_school_db_user',
    host: 'cp2ta4i1hbls7384hjf0-a.frankfurt-postgres.render.com',
    password: '5TfZRQ3mKJ1ZXk0gcbAAzsSeHa30HDpi',
    database: 'express_school_db',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};