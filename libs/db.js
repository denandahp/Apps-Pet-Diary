//const database = require('../configs.json').database;
const dotenv = require('dotenv');
dotenv.config();
const database = {
    user : process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    sslmode: process.env.POSTGRES_SSLMODE,
    post: process.env.POSTGRES_PORT
  };
  console.log(database);

const { Pool } = require('pg');

module.exports = new Pool(database);