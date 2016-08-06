const { appid, secret } = require('../config')
const rp = require('request-promise')

module.exports = {
  reqAccessToken,
}

function reqAccessToken () {
  const grant_type = 'client_credential'
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=${grant_type}&appid=${appid}&secret=${secret}`
  return rp({ json: true, url })
    .then(data => {
      const { errcode, errmsg } = data
      if (errcode) {
        throw new Error(`${errcode}: ${errmsg}`)
      }
      const { access_token, expires_in } = data
      return { access_token, expires_in }
    })
}
