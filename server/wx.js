const { appId, secret } = require('../config')
const wxsign = require('./wxsign')
const rp = require('request-promise')
const db = require('lowdb')(__dirname + '/../db.wx.json')

const kJsapiTicket = 'jsapi_ticket'
const kAccessToken = 'access_token'

module.exports = {
  getJsApiSign,
}

function tss () {
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
  const { jsapi_ticket, timestamp, signature, nonceStr } = wxsign(ticket, referer)
  return {
    jsapi_ticket, timestamp, signature, nonceStr,
    appId
  }
}

function* getJsApiTicket () {
  let item = db.get(kJsapiTicket).value()
  if (item && item.deadline - tss() > 60) {
    return item
  }
  const { ticket, expires_in } = yield reqJsApiTicket()
  item = {
    ticket,
    deadline: expires_in + tss()
  }
  db.set(kJsapiTicket, item).value()
  return item
}

function* reqJsApiTicket () {
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

function* getAccessToken () {
  let item = db.get(kAccessToken).value()
  if (item && item.deadline - tss() > 60) {
    return item
  }
  const { access_token, expires_in } = yield reqAccessToken()
  item = {
    access_token,
    deadline: expires_in + tss()
  }
  db.set(kAccessToken, item).value()
  return item
}

function* reqAccessToken () {
  const url =
    'https://api.weixin.qq.com/cgi-bin/token' +
    `?grant_type=client_credential&appid=${appId}` +
    `&secret=${secret}`
  const data = yield rp({ url, json: true })
  const { errcode, errmsg } = data
  if (errcode) {
    throw new Error(`${errcode}: ${errmsg}`)
  }
  const { access_token, expires_in } = data
  return { access_token, expires_in }
}
