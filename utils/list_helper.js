'use strict'

const dummy = () => 1

const totalLikes = (blogs) =>
  blogs.map(x => x.likes)
    .reduce((x, y) => x + y, 0)

const favoriteBlog = (blogs) =>
  blogs.length === 0 ? null : blogs.reduce((b1, b2) => b1.likes > b2.likes ? b1 : b2)


module.exports = { dummy , totalLikes , favoriteBlog }
