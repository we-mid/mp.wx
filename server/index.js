require('./console')
const wx = require('./wx')
const posts = require('./posts')
const fs = require('fs-extra-promise')
const koa = require('koa')
const mount = require('koa-mount')
const serve = require('koa-static')
const Router = require('koa-router')
const koaCors = require('koa-cors')
const koaBetterBody = require('koa-better-body')
const { join, basename } = require('path')
const uploadPath = join(__dirname, '../upload')

fs.ensureDirSync(uploadPath)

const app = koa()
const cors = koaCors({
  origin: '*'
})
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

router.post('/submit', koaBetterBody(), function* () {
  const form = this.request.fields
  const { id } = posts.submitPost(form)
  this.body = { url: `/show/${id}` }
})
router.get('/get/:id', function* () {
  const { id } = this.params
  const data = posts.getPost(id)
  if (!data) {
    return this.status = 404
  }
  this.body = data
})

app.use(cors)
app.use(router.routes())
app.use(mount('/upload', serve(uploadPath)))
app.listen(8099)
