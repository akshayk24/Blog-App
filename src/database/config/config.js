const dotenv = require('dotenv');
dotenv.config();

const env = process.env.NODE_ENV || 'development';

module.exports = (function () {
    switch (env) {
        case 'development':
            return {
                username: 'postgres',
                password: 'password',
                database: 'blogs_db',
                host: 'localhost',
                port: '5432',
                dialect: 'postgres',
            };
        case 'production':
            return {
                username: process.env.PG_USER,
                password: process.env.PG_PASSWORD,
                database: process.env.PG_DB,
                host: process.env.PG_HOST,
                port: process.env.PG_PORT,
                dialect: 'postgres',
            };
        case 'test':
            return {
                username: 'postgres',
                password: 'password',
                database: 'blogs_db',
                host: 'localhost',
                port: '5432',
                dialect: 'postgres',
            };
    }
})();
