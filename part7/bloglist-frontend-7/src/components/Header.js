import { useDispatch, useSelector } from 'react-redux'

import TextField, { useField } from '../components/TextField'
import { login, logout, loginSelector } from '../reducers/loginReducer'
import { NotificationCenter } from '../components/Notification'

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

const Header = () => {
  const dispatch = useDispatch()
  const user = useSelector(loginSelector)
  return (
    <div>
      <NotificationCenter />
      <div hidden={user != null}>
        <LoginForm />
      </div>
      <div hidden={user == null}>
        <h2>blogs</h2>
        <p>
          {user?.name} logged in{' '}
          <button onClick={() => dispatch(logout())}> Logout</button>
        </p>
      </div>
    </div>
  )
}

export default Header
