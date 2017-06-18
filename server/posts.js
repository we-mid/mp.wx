const uuid = require('uuid').v4
const _ = require('lodash')
const db = require('lowdb')(__dirname + '/../db.posts.json')

const kPosts = 'posts'

db.defaults({
  [kPosts]: []
}).value()

module.exports = {
  submitPost,
  getPost,
}

function submitPost (form) {
  console.log('submitPost form', form)
  const data = _.pick(form, [
    'showType', 'shareTitle',
    'shareDesc', 'shareImage',
  ])
  const { showType } = form
  if (showType === 'text') {
    Object.assign(data, _.pick(form, [
      'showText', 'showTextSize'
    ]))
  } else if (showType === 'image') {
    Object.assign(data, _.pick(form, [
      'showImage'
    ]))
  }
  data.id = uuid()
  db.get(kPosts).push(data).value()
  return data
}

function getPost (id) {
  console.log('getPost id', id)
  const data = db.get(kPosts).find({ id }).value()
  return data
}
