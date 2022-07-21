import { useState, useEffect, useRef } from 'react'

import BlogList from './components/BlogList'
import TextField from './components/TextField'
import { useNotification, NotificationCenter } from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'



const LoginForm = ({ handleLogin }) => {
  if (typeof handleLogin !== 'function') {
    console.error(`
This component requires an attribute 'handleLogin',
which is a function that takes a username and a password,
and then performs the login.
`)
  }
  const fieldRefs = [useRef(), useRef()]
  const submit = (event) => {
    event.preventDefault()
    const { username, password } = event.target
    handleLogin(username.value, password.value)
    fieldRefs.forEach(x => x.current.clear())
  }
  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={submit}>
        <TextField name='username' prompt='username: ' ref={fieldRefs[0]}/>
        <TextField name='password' prompt='pasword: ' type='password' ref={fieldRefs[1]}/>
        <input type='submit' />
      </form>
    </div>
  )
}

const App = () => {
  const [blogs, _setBlogs] = useState([])
  const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('user')))
  const [notifications, pushNotification, pushError] = useNotification()

  const setBlogs = (blogs) => {
    blogs.sort((l, r) => r.likes - l.likes)
    _setBlogs(blogs)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    blogService.setToken(user && user.token)
  }, [user])

  const login = (user) => {
    setUser(user)
    window.localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('user')
  }

  const submitBlog = async ({ title, url, author }) => {
    try {
      const blog = await blogService.post({ title, author, url, likes: 0 })
      setBlogs(blogs.concat(blog))
      pushNotification(`A new blog ${title} by ${author} is added`)
    } catch (error) {
      if (error instanceof blogService.BlogServiceError) {
        pushError(error.message)
      } else {
        pushError(`Unknown error: ${error.message}`)
        throw error
      }
    }
  }

  const likeBlog = async (blog) => {
    try {
      const newBlog = { ...blog, likes: blog.likes + 1 }
      await blogService.put(blog.id, newBlog)
      setBlogs(blogs.map(b => b.id === newBlog.id ? newBlog : b))
    } catch (error) {
      if (error instanceof blogService.BlogServiceError) {
        pushError(`Can't like ${blog.name}: ${error.message}`)
      } else {
        pushError(`Unknown Error: ${error.message}`)
        throw error
      }
    }
  }

  const deleteBlog = async(blog) => {
    if (!window.confirm(`Remove blog ${blog.name} by ${blog.author} ?`)){
      return
    }
    try {
      await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    } catch (error) {
      if (error instanceof blogService.BlogServiceError) {
        pushError(`Can't delete ${blog.name}: ${error.message}`)
      } else {
        pushError(`Unknown Error: ${error.message}`)
        throw error
      }

    }
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      pushNotification(`Login success! Hello ${user.name}`)
      login(user)
    } catch (error) {
      if (error instanceof loginService.BadLogin) {
        pushError(error.message)
      } else {
        throw error // unexcpected error
      }
    }
  }
  const handleLogout = () => {
    logout()
    pushNotification('Logout success!')
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
      <NotificationCenter notifications={notifications} />
      <div hidden={user != null}>
        <LoginForm handleLogin={handleLogin}/>
      </div>
      <div hidden={user == null}>
        <BlogList username={user == null ? null : user.username}
          header={blogHeader}
          submitBlog={submitBlog}
          blogs={blogs}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog} />
      </div>
    </div>
  )
}

export default App
