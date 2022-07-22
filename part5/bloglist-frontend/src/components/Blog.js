import { useState } from 'react'
import PropTypes from 'prop-types'

export const BlogType = PropTypes.exact({
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
})

export const Blog = ({ blog, doLike, doDelete }) => {
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
  const deleteButton = (doDelete == null) ? null : (<p><button onClick={doDelete}> delete </button></p>)
  return (
    <div className='blogItem' style={blogstyle}>
      <p> {blog.title} {blog.author} {toggleDetail}</p>
      <div className='blogItemDetail' style={{ display: detailVisible ? '' : 'none' }} >
        <p> {blog.url} </p>
        <p> likes: {blog.likes} <button className='likeBlog' onClick={doLike}> like </button> </p>
        <p> {blog.user.name} </p>
        {deleteButton}
      </div>
    </div>
  )}

Blog.propTypes = {
  blog: BlogType,
  doLike: PropTypes.func.isRequired,
  doDelete: PropTypes.func,
}

export default Blog
