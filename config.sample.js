const { join } = require('path')
const dbPath = join(__dirname, 'db.json')

const appId = 'wxXXXXXXXXXXXXXXXX'
const secret = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

module.exports = {
  dbPath,
  appId,
  secret,
}
