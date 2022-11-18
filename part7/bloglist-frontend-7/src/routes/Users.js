import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { usersSelector, getUsers } from '../reducers/usersReducer'

const Users = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUsers())
  }, [])
  const users = useSelector(usersSelector)
  return (
    <div>
      <h2> Users </h2>
      <table>
        <tbody>
          <tr><th> Name </th><td> blogs </td></tr>
          {users && users.map((user) => (<tr key={user.username}><th> {user.name} </th><td> {user.blogs.length} </td></tr>))}
        </tbody>
      </table>
    </div>)
}

export default Users
