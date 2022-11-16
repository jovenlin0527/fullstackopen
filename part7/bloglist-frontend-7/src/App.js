import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import sortBy from 'lodash.sortby'

import BlogList from './components/BlogList'
import TextField, { useField } from './components/TextField'
import { NotificationCenter } from './components/Notification'
import { notifyError } from './reducers/notificationReducer'
import { setUser, login, logout, loginSelector } from './reducers/loginReducer'
import {
  setBlogs as setBlogsAction,
  getBlogs,
  deleteBlog as deleteBlogAction,
  blogsSelector,
} from './reducers/blogsReducer'

import blogService from './services/blogs'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useField()
  const [password, setPassword] = useField({ type: 'password' })
  const submit = (event) => {
    event.preventDefault()
    const { username, password } = event.target
    dispatch(login({ username: username.value, password: password.value }))
    setUsername('')
    setPassword('')
  }
  return (
    <div>
      <h2>log in to application</h2>
      <form className="loginForm" onSubmit={submit}>
        <TextField
          id="username"
          name="username"
          prompt="username: "
          {...username}
        />
        <TextField
          id="password"
          name="password"
          prompt="pasword: "
          type="password"
          {...password}
        />
        <input type="submit" />
      </form>
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user != null) {
      dispatch(setUser(user))
    }
  }, [])

  useEffect(() => {
    dispatch(getBlogs())
  }, [])

  const user = useSelector(loginSelector)
  const blogs = useSelector((s) => {
    let blogs = blogsSelector(s)
    return sortBy(blogs, (b) => -b.likes)
  })

  const setBlogs = (blogs) => {
    dispatch(setBlogsAction(blogs))
  }

  const likeBlog = async (blog) => {
    try {
      const newBlog = { ...blog, likes: blog.likes + 1 }
      await blogService.put(blog.id, newBlog)
      setBlogs(blogs.map((b) => (b.id === newBlog.id ? newBlog : b)))
    } catch (error) {
      if (error instanceof blogService.BlogServiceError) {
        dispatch(notifyError(`Can't like ${blog.name}: ${error.message}`))
      } else {
        dispatch(notifyError(`Unknown Error: ${error.message}`))
        throw error
      }
    }
  }

  const deleteBlog = (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
      return
    }
    dispatch(deleteBlogAction(blog.id))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const blogHeader = user && (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}> Logout</button>
      </p>
    </div>
  )

  return (
    <div>
      <NotificationCenter />
      <div hidden={user != null}>
        <LoginForm />
      </div>
      <div hidden={user == null}>
        <BlogList
          username={user == null ? null : user.username}
          header={blogHeader}
          blogs={blogs}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
        />
      </div>
    </div>
  )
}

export default App
