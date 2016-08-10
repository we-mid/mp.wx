const { dbpath } = require('../config')
const low = require('lowdb')

const db = low(config.dbpath)
module.exports = db
