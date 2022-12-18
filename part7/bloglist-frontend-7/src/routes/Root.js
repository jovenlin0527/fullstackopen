import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { loginSelector } from '../reducers/loginReducer'
import NavigationBar from '../components/NavigationBar'
import { NotificationCenter } from '../components/Notification'

const Root = () => {
  const user = useSelector(loginSelector)

  return (
    <div>
      <NavigationBar />
      <NotificationCenter />
      <div hidden={user == null}>
        <Outlet />
      </div>
    </div>
  )
}

export default Root
