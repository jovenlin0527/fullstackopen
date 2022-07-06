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

const initializeUsers = async () => {
  await User.deleteMany({})
  return await User.create(initialUsers)
}

const initializeDb = async () => {
  const [user] = await initializeUsers()
  await Blog.deleteMany({}).lean().select('_id')
  const userId = user._id
  await Promise.all(initialBlogs.map(b => Blog.create({ ...b, user: userId } )))
}

/* A blog that is not in initialBlogs, suitable for testing. */
const newBlog = {
  title: 'new title',
  author: 'new author',
  url: 'http://new-loclahost/',
  likes: 99999,
}

/* A user that is not in initialUsers, suitable for testing */
const newUser = {
  username: 'newUsername',
  name: 'new name',
  password: 'newPassword'
}

const currentBlogs = () => Blog.find({})

const nonexistentBlogId = async ({ _id : userId }) => {
  if (userId == null) {
    return null
  }
  const nonexistentBlog = await Blog.create({ ...newBlog, user: userId })
  const id = nonexistentBlog.id
  await nonexistentBlog.remove()
  return id
}



module.exports = { initialBlogs , currentBlogs, nonexistentBlogId, initialUsers, initializeUsers, initializeDb, newUser, newBlog }
