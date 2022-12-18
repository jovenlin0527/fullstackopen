import { useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'

import { usersSelector } from '../reducers/usersReducer'

import UserDetail from '../components/UserDetail'

const UsersList = ({ users }) => {
  return (
    <div>
      <h2> Users </h2>
      <table>
        <tbody>
          <tr>
            <th> Name </th>
            <td> blogs </td>
          </tr>
          {users &&
            users.map((user) => (
              <tr key={user.username}>
                <th>
                  <Link to={`/users/${user.id}`}> {user.name} </Link>
                </th>
                <td> {user.blogs.length} </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

const Users = () => {
  const users = useSelector(usersSelector)
  const { userId } = useParams()
  if (users == null) {
    return <></> // loading
  }
  if (userId == null) {
    return <UsersList users={users} />
  } else {
    const user = users.find(({ id }) => id === userId)
    return user == null ? null : <UserDetail user={user} />
  }
}

export default Users
