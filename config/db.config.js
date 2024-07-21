const {config} = require("dotenv");
require('dotenv').config();

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    DIALECT: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true', // Convert string to boolean
    dialectOptions: {
        // ssl: {
        //     require: process.env.DB_SSL === 'true',
        //     rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
        // }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

