import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { loginSelector } from '../reducers/loginReducer'
import { getBlogs } from '../reducers/blogsReducer'
import NavigationBar from '../components/NavigationBar'
import { NotificationCenter } from '../components/Notification'

const Root = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBlogs())
  }, [])

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
