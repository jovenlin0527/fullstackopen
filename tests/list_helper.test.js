const listHelper = require('../utils/list_helper')
const { initialBlogs: blogs } = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = blogs.slice(0, 1)
  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list only has one blog, equals the like with that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(7)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blogs', () => {
  const listWithOneBlog = blogs.slice(0, 1)
  test('of empty list is null', () => {
    expect(listHelper.favoriteBlog([])).toBeNull()
  })

  test('of singleton list it\'s the only item', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toBe(listWithOneBlog[0])
  })

  test('of longer list it\'s the item with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(expect.anything())
    const blogsWithNoLessLikes = blogs.filter(b => b.likes >= result.likes)
    expect(blogsWithNoLessLikes.every(b => b.likes === result.likes)).toBe(true)
    expect(blogsWithNoLessLikes).toContain(result)
  })
})

describe('author with most blogs', () => {
  test('of empty list is null', () => {
    expect(listHelper.mostBlogs([])).toBeNull()
  })
  test('of singleton list is the only author', () => {
    const result = listHelper.mostBlogs(blogs.slice(0, 1))
    const expected = {
      author: blogs[0].author,
      blogs: 1
    }
    expect(result).toEqual(expected)
  })
  test('of longer list it\'s the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    expect(result).toEqual(expected)

  })
})


describe('author with most likes', () => {
  test('of empty list is null', () => {
    expect(listHelper.mostLikes([])).toBeNull()
  })

  test('of singleton list is the only author', () => {
    const result = listHelper.mostLikes(blogs.slice(0, 1))
    const expected = {
      author: blogs[0].author,
      likes: blogs[0].likes
    }
    expect(result).toEqual(expected)
  })

  test('of longer list it\'s the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    expect(result).toEqual(expected)

  })

})
