require('./console')
const { getJsApiSign } = require('./wx')
const co = require('co')
const koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')
const { join } = require('path')
const publicPath = join(__dirname, '../public')

co(function* () {
  return yield getJsApiSign('http://fritx.me')
})
.then(console.log, console.error)

const app = koa()
const router = new Router()

router.use('/', serve(publicPath))

router.get('/wxsign', function* () {
  const sign = yield getJsApiSign(this.request)
  this.body = sign
})

app.use(router.routes())
app.listen(8099)
