import { useState, useEffect, useRef} from 'react'

import Blog from './components/Blog'
import {useNotification, NotificationCenter} from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const TextField = ({id, name, prompt, type}) => {
  const [text, setText] = useState('')
  type = type ?? 'text'
  id = id ?? name + '_id'
  const update = (event) => {
    setText(event.target.value)
  }
  return (
    <div>
      <label htmlFor={id}>{prompt}</label>
      <input id={id} name={name} value={text} onChange={update} type={type} />
    </div>
  )
}

const LoginForm = ({ handleLogin, ...prop}) => {
  if (typeof handleLogin !== 'function') {
    console.error(`
This component requires an attribute 'handleLogin',
which is a function that takes a username and a password,
and then performs the login.
`)
  }
  const submit = (event) => {
    event.preventDefault()
    const {username, password} = event.target
    handleLogin(username.value, password.value)
  }
  return (
    <div {...prop}>
      <h2>log in to application</h2>
      <form onSubmit={submit}>
          <TextField name='username' prompt='uesrname: '/>
          <TextField name='password' prompt='pasword: ' type='password' />
          <input type='submit' />
      </form>
    </div>
  )
}

const BlogList = ({name, blogs, handleLogout, ...props}) => {
  return (
    <div {...props}>
      <h2>blogs</h2>
      <p> {name} logged in <button onClick={handleLogout}> Logout</button> </p>
      <div>
      </div>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )
}

const BlogForm = ({ handleSubmit, token, ...prop }) => {
  const submit = (event) => {
    event.preventDefault()
    const {title, author, url} = event.target
    handleSubmit({title: title.value, author: author.value, url: url.value})
  }
  return (
    <div {...prop}>
      <form onSubmit={submit}>
        <TextField name='title' prompt='title: ' />
        <TextField name='author' prompt='author: ' />
        <TextField name='url' prompt='url: ' />
        <input type='submit' />
      </form>
    </div>
  )
}


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('user')))
  const [notifications, pushNotification, pushError] = useNotification()

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

  const submitBlog = async ({title, url, author}) => {
    try {
      const blog = await blogService.post({title, author, url, likes: 0})
      setBlogs(blogs.concat(blog))
      pushNotification(`A new blog ${title} by ${author} is added`)
    } catch (error) {
      if (error instanceof blogService.PostError) {
        pushError(error.message)
      } else {
        throw error
      }
    }
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({username, password})
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
    pushNotification("Logout success!")
  }

  return (
    <div>
      <NotificationCenter notifications={notifications} />
      <LoginForm handleLogin={handleLogin} hidden={user != null}/>
      <BlogList blogs={blogs} name={user?.name} hidden={user==null} handleLogout={handleLogout}/>
      <BlogForm token={user && user.token} hidden={user==null} handleSubmit={submitBlog}/>
    </div>
  )
}

export default App
