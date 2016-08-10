const { join } = require('path')
const dbpath = join(__dirname, 'db.json')

const appid = 'wxXXXXXXXXXXXXXXXX'
const secret = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

module.exports = {
  dbpath,
  appid,
  secret,
}
