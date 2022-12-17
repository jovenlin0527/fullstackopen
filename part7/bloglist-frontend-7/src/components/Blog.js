import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { BlogType } from './PropTypes'
import { likeBlog, deleteBlog } from '../reducers/blogsReducer'
import { loginSelector } from '../reducers/loginReducer'

export const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const blogstyle = {
    paddingLeft: 2,
    border: 'solid',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: '5px',
  }
  const navigate = useNavigate()

  const doLike = () => dispatch(likeBlog(blog.id))
  const doDelete = async () => {
    await dispatch(deleteBlog(blog.id)).unwrap()
    navigate('/')
  }
  const currentUser = useSelector(loginSelector)

  const deleteButton =
    currentUser?.username !== blog.user.username ? null : (
      <p>
        <button onClick={() => doDelete()}> remove </button>
      </p>
    )

  return (
    <div className="blogItem" style={blogstyle}>
      <h2> {blog.title} </h2>
      <p>author: {blog.author}</p>
      <div className="blogItemDetail">
        <p>
          {' '}
          url: <a href={blog.url}>{blog.url}</a>{' '}
        </p>
        <p>
          {' '}
          likes: {blog.likes}{' '}
          <button className="likeBlog" onClick={doLike}>
            {' '}
            like{' '}
          </button>{' '}
        </p>
        <p> added by: {blog.user.name} </p>
        {deleteButton}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: BlogType.isRequired,
}

export default Blog
