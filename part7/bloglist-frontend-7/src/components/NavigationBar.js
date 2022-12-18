import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import TextField, { useField } from '../components/TextField'
import { login, logout, loginSelector } from '../reducers/loginReducer'
import './NavigationBar.css'

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
    <>
      <form className="headerItem" data-testid="loginForm" onSubmit={submit}>
        <div className="headerItem">
          <TextField
            id="username"
            name="username"
            prompt="username: "
            {...username}
          />
        </div>
        <div className="headerItem">
          <TextField
            id="password"
            name="password"
            prompt="pasword: "
            type="password"
            {...password}
          />
        </div>
        <input className="headerItem" type="submit" />
      </form>
    </>
  )
}

const LoginPanel = ({ user }) => {
  const dispatch = useDispatch()
  if (user == null) {
    return <LoginForm />
  } else {
    return (
      <div className="headerItem">
        <p className="headerItem"> {user?.name} logged in </p>
        <button onClick={() => dispatch(logout())}> Logout</button>
      </div>
    )
  }
}

const NavigationBar = () => {
  const user = useSelector(loginSelector)
  return (
    <div data-testid="navigationBar">
      <p className="headerItem">
        <Link to="/">blogs</Link>
      </p>
      <p className="headerItem">
        <Link to="/users">users</Link>
      </p>
      <LoginPanel user={user} />
    </div>
  )
}

export default NavigationBar
