const { dbpath } = require('../config')
const low = require('lowdb')

const db = low(dbpath)
module.exports = db
