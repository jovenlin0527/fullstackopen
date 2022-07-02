'use strict'

const dummy = () => 1

const totalLikes = (blogs) =>
  blogs.map(x => x.likes)
    .reduce((x, y) => x + y, 0)

module.exports = { dummy , totalLikes }
