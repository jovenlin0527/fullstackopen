import React from 'react'
import PropTypes from 'prop-types'

export const BlogType = PropTypes.exact({
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
})

export const Blog = ({ blog, visible, doShow, doHide, doLike, doDelete }) => {
  const blogstyle = {
    paddingLeft: 2,
    border: 'solid',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: '5px',
  }
  const toggleVisible = visible
    ? (<button onClick={doHide}>hide</button>)
    : (<button onClick={doShow}>show</button>)
  const deleteButton = (doDelete == null) ? null : (<p><button onClick={doDelete}> delete </button></p>)
  return (
    <div style={blogstyle}>
      <p> {blog.title} {blog.author} {toggleVisible}</p>
      <div style={{ display: visible ? '' : 'none' }} >
        <p> {blog.url} </p>
        <p> likes: {blog.likes} <button onClick={doLike}> like </button> </p>
        <p> {blog.user.name} </p>
        {deleteButton}
      </div>
    </div>
  )}

Blog.propTypes = {
  blog: BlogType,
  visible: PropTypes.bool,
  doShow: PropTypes.func.isRequired,
  doHide: PropTypes.func.isRequired,
  doLike: PropTypes.func.isRequired,
  doDelete: PropTypes.func,
}

export default Blog
