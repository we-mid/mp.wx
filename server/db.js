const { dbPath } = require('../config')
const low = require('lowdb')

const db = low(dbPath)
module.exports = db
