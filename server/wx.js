const { dbpath, appid, secret } = require('../config')
const wxsign = require('./wxsign')
const db = require('./db')
const rp = require('request-promise')

module.exports = {
  getJsApiSign,
}

function tss() {
  return Math.floor(Date.now() / 1000)
}

function* getJsApiSign (req) {
  const referer = req.get('referer') || ''
  // var refhost = url.parse(referer).hostname
  // if (!_.any(config.wxm.trustedhosts, function(host){
  //   return isOf(host, refhost)
  // })) {
  //   return cb(new Error('host not trusted'))
  // }
  const { jsapi_ticket } = yield getJsApiTicket()
  //const sign = wxsign(jsapi_ticket, fullUrl(req))
  const sign = wxsign(jsapi_ticket, referer)
  sign.appId = appid
  return sign
}

function* getJsApiTicket () {
  let item = db.get('jsapi_ticket').value()
  if (item && item.deadline - tss() > 60) {
    return item
  }
  const { ticket, expires_in } = yield reqJsApiTicket()
  item = {
    ticket,
    deadline: expires_in + tss()
  }
  db.set('jsapi_ticket', item)
  return item
}

function* reqJsApiTicket() {
  const { access_token } = yield getAccessToken()
  const url =
    'https://api.weixin.qq.com/cgi-bin/ticket' +
    `/getticket?access_token=${access_token}` +
    '&type=jsapi'
  const { errcode, errmsg } = yield rp({ url, json: true })
  if (errcode) {
    throw new Error(`${errcode}: ${errmsg}`)
  }
  return { errcode, errmsg }
}

function* getAccessToken() {
  let item = db.get('access_token').value()
  if (item && item.deadline - tss() > 60) {
    return item
  }
  const { access_token, expires_in } = yield reqAccessToken()
  item = {
    access_token,
    deadline: expires_in + tss()
  }
  db.set('access_token', item)
  return item
}

function* reqAccessToken() {
  const url =
    'https://api.weixin.qq.com/cgi-bin/token' +
    `?grant_type=client_credential&appid=${appid}` +
    `&secret=${secret}`
  const { errcode, errmsg } = rp({ url, json: true })
  if (errcode) {
    throw new Error(`${errcode}: ${errmsg}`)
  }
  return { errcode, errmsg }
}
