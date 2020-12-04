const Sequelize = require('sequelize');
const { logger } = require('../config/logger');
const mysqldb = new Sequelize('bamboo', 'bamboo', '123456', {
  host: '127.0.0.1',
  port: '3306',
  dialect: 'mysql',
  dialectOptions: {
    charset: "utf8mb4",
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00',//东八时区
  logging: function (msg) {
    logger.info(msg)
  },
});



module.exports = {
  mysqldb
}
