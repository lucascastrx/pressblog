const sequelize = require('sequelize')
const conn = new sequelize('pressblog', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '-03:00'
})

module.exports = conn
