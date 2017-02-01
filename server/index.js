require('./console')
const wx = require('./wx')
const fs = require('fs-extra-promise')
const koa = require('koa')
const mount = require('koa-mount')
const serve = require('koa-static')
const Router = require('koa-router')
const koaBetterBody = require('koa-better-body')
const { join, basename } = require('path')
const uploadPath = join(__dirname, '../upload')
const publicPath = join(__dirname, '../public')

fs.ensureDirSync(uploadPath)

const app = koa()
const router = new Router()

router.get('/wxsign', function* () {
  const referer = this.request.get('referer')
  const sign = yield wx.getJsApiSign(referer)
  this.body = sign
})

router.post('/upload', koaBetterBody({
  uploadDir: uploadPath,
  keepExtensions: true
}), function* () {
  const { path } = this.request.files.image
  this.body = { url: `/upload/${basename(path)}` }
})

app.use(router.routes())
app.use(serve(publicPath))
app.use(mount('/upload', serve(uploadPath)))
app.listen(8099)
