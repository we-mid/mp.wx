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

function* getJsApiSign (referer) {
// function* getJsApiSign (req) {
  // const referer = req.get('referer') || ''
  // var refhost = url.parse(referer).hostname
  // if (!_.any(config.wxm.trustedhosts, function(host){
  //   return isOf(host, refhost)
  // })) {
  //   return cb(new Error('host not trusted'))
  // }
  const { ticket } = yield getJsApiTicket()
  //const sign = wxsign(ticket, fullUrl(req))
  const sign = wxsign(ticket, referer)
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
  db.set('jsapi_ticket', item).value()
  return item
}

function* reqJsApiTicket() {
  const { access_token } = yield getAccessToken()
  const url =
    'https://api.weixin.qq.com/cgi-bin/ticket' +
    `/getticket?access_token=${access_token}` +
    '&type=jsapi'
  const data = yield rp({ url, json: true })
  const { errcode, errmsg } = data
  if (errcode) {
    throw new Error(`${errcode}: ${errmsg}`)
  }
  const { ticket, expires_in } = data
  return { ticket, expires_in }
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
  db.set('access_token', item).value()
  return item
}

function* reqAccessToken() {
  const url =
    'https://api.weixin.qq.com/cgi-bin/token' +
    `?grant_type=client_credential&appid=${appid}` +
    `&secret=${secret}`
  const data = yield rp({ url, json: true })
  const { errcode, errmsg } = data
  if (errcode) {
    throw new Error(`${errcode}: ${errmsg}`)
  }
  const { access_token, expires_in } = data
  return { access_token, expires_in }
}
