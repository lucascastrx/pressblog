const sequelize = require('sequelize')
const conn = new sequelize('pressblog', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = conn
