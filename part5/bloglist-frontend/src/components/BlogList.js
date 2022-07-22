import { useRef } from 'react'
import PropTypes from 'prop-types'

import Togglable from './Togglable'
import Blog, { BlogType } from './Blog'
import BlogForm from './BlogForm'

const BlogList = ({ username, header, blogs, submitBlog, likeBlog, deleteBlog }) => {
  const formRef = useRef()
  const submit = (...args) => {
    formRef.current.toggleVisibility()
    return submitBlog(...args)
  }
  return (
    <div>
      {header}
      <div className='blogList'>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog}
            doLike={() => likeBlog(blog)}
            doDelete={ username === blog.user.username ? () => {deleteBlog(blog)} : null }
          />
        )}
      </div>
      <Togglable buttonLabel="create new blog" ref={formRef} style={{ border:'solid', borderRadius:'15px', padding:'5px' }}>
        <BlogForm submitBlog={submit}/>
      </Togglable>

    </div>
  )
}

BlogList.propTypes = {
  username: PropTypes.string,
  header: PropTypes.element,
  blogs: PropTypes.arrayOf(BlogType).isRequired,
  submitBlog: PropTypes.func.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

export default BlogList
