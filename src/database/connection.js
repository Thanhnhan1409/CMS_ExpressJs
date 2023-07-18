/* eslint-disable no-undef */
require('dotenv').config();
const knex = require('knex')({
    client: 'mysql',
    connection: {
        port: 3306,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAMEDBSGROUP,
    },
    pool: {
        min: 2,
        max: 10,
    },
});
knex.raw('SELECT 1')
    .then(() => {
        console.log('Connected to Knex Database');
    })
    .catch((err) => {
        throw err;
    });

module.exports = knex;