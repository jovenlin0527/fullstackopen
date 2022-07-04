const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

const initialUsers = [
  {
    username: 'root',
    password: 'p4$$W0rd',
    name: 'Phoenix Wright'
  }
]

const initializeBlogs = async () => {
  await Blog.deleteMany({})
  for (const b of initialBlogs) {
    await Blog.create(b) // avoid race condition: multiple blogs may try to add itself to the same user.
  }
}

const initializeUsers = async () => {
  await User.deleteMany({})
  await User.create(initialUsers)
}

const initializeDb = async () => {
  await initializeUsers()
  await initializeBlogs()
}

const currentBlogs = () => Blog.find({})

const nonexistentBlogId = async () => {
  const newBlog = await Blog.create({
    title: 'title',
    author: 'author',
    url: 'http://localhost/',
    likes: 0
  })
  const id = newBlog.id
  await Blog.findByIdAndDelete(id)
  return id
}

module.exports = { initialBlogs , currentBlogs, nonexistentBlogId , initializeBlogs, initialUsers, initializeUsers, initializeDb }
