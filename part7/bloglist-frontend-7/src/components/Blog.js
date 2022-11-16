import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { likeBlog, deleteBlog } from '../reducers/blogsReducer'
import { loginSelector } from '../reducers/loginReducer'

export const BlogType = PropTypes.exact({
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
})

export const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const [detailVisible, setDetailVisible] = useState(false)
  const blogstyle = {
    paddingLeft: 2,
    border: 'solid',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: '5px',
  }

  const doToggleDetail = () => setDetailVisible(!detailVisible)

  const toggleDetail = (
    <button className="toggleBlogDetail" onClick={doToggleDetail}>
      {detailVisible ? 'hide' : 'show'}
    </button>
  )
  const doLike = () => dispatch(likeBlog(blog.id))
  const currentUser = useSelector(loginSelector)

  const deleteButton =
    currentUser?.username !== blog.user.username ? null : (
      <p>
        <button onClick={() => dispatch(deleteBlog(blog.id))}> remove </button>
      </p>
    )

  return (
    <div className="blogItem" style={blogstyle}>
      <p>
        {' '}
        {blog.title} {blog.author} {toggleDetail}
      </p>
      <div
        className="blogItemDetail"
        style={{ display: detailVisible ? '' : 'none' }}
      >
        <p> {blog.url} </p>
        <p>
          {' '}
          likes: {blog.likes}{' '}
          <button className="likeBlog" onClick={doLike}>
            {' '}
            like{' '}
          </button>{' '}
        </p>
        <p> {blog.user.name} </p>
        {deleteButton}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: BlogType,
}

export default Blog
