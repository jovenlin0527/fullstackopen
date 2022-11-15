import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import BlogList from './components/BlogList'
import TextField from './components/TextField'
import { NotificationCenter } from './components/Notification'
import { notify, notifyError } from './reducers/notificationReducer'
import { setUser, login, logout, loginSelector } from './reducers/loginReducer'

import blogService from './services/blogs'

const LoginForm = () => {
  const dispatch = useDispatch()
  const fieldRefs = [useRef(), useRef()]
  const submit = (event) => {
    event.preventDefault()
    const { username, password } = event.target
    dispatch(login({ username: username.value, password: password.value }))
    fieldRefs.forEach((x) => x.current.clear())
  }
  return (
    <div>
      <h2>log in to application</h2>
      <form className="loginForm" onSubmit={submit}>
        <TextField
          id="username"
          name="username"
          prompt="username: "
          ref={fieldRefs[0]}
        />
        <TextField
          id="password"
          name="password"
          prompt="pasword: "
          type="password"
          ref={fieldRefs[1]}
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

  const [blogs, _setBlogs] = useState([])
  const user = useSelector(loginSelector)

  const setBlogs = (blogs) => {
    blogs.sort((l, r) => r.likes - l.likes)
    _setBlogs(blogs)
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    blogService.setToken(user && user.token)
  }, [user])

  const submitBlog = async ({ title, url, author }) => {
    try {
      const blog = await blogService.post({ title, author, url, likes: 0 })
      setBlogs(blogs.concat(blog))
      dispatch(notify(`A new blog ${title} by ${author} is added`))
    } catch (error) {
      if (error instanceof blogService.BlogServiceError) {
        dispatch(notifyError(error.message))
      } else {
        dispatch(notifyError(`Unknown error: ${error.message}`))
        throw error
      }
    }
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

  const deleteBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
      return
    }
    try {
      await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      dispatch(notify(`Removed ${blog.title}`))
    } catch (error) {
      if (error instanceof blogService.BlogServiceError) {
        dispatch(notifyError(`Can't remove ${blog.title}: ${error.message}`))
      } else {
        dispatch(notifyError(`Unknown Error: ${error.message}`))
        throw error
      }
    }
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
          submitBlog={submitBlog}
          blogs={blogs}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
        />
      </div>
    </div>
  )
}

export default App
