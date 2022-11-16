import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { loginSelector } from '../reducers/loginReducer'
import { getBlogs } from '../reducers/blogsReducer'
import Header from '../components/Header'

const Root = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBlogs())
  }, [])

  const user = useSelector(loginSelector)

  return (
    <div>
      <Header />
      <div hidden={user == null}>
        <Outlet />
      </div>
    </div>
  )
}

export default Root
