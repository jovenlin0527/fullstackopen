'use strict'

const _ = require('lodash')

const dummy = () => 1

const totalLikes = (blogs) =>
  blogs.map(x => x.likes)
    .reduce((x, y) => x + y, 0)

const favoriteBlog = (blogs) =>
  blogs.length === 0 ? null : blogs.reduce((b1, b2) => b1.likes > b2.likes ? b1 : b2)

const mostBlogs = (arr) => {
  if (arr == null || arr.length == 0) {
    return null
  }
  let [author, blogs] = _.chain(arr)
    .countBy(o => o.author)
    .toPairs()
    .maxBy(x => x[1])
    .value()
  return { author, blogs }
}

const mostLikes = (arr) => {
  if (arr == null || arr.length == 0) {
    return null
  }
  let [author, likes] = _.chain(arr)
    .groupBy(o => o.author)
    .toPairs()
    .map(([author, blogs]) => [author, _.reduce(blogs, (x, y) => (x + y.likes), 0)])
    .maxBy(([_, likes]) => likes)
    .value();
  return {author, likes}
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
