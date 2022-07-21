import { useRef } from 'react'
import PropTypes from 'prop-types'

import TextField from './TextField'
import Togglable from './Togglable'
import Blog, { BlogType } from './Blog'



const BlogForm = ({ submitBlog }) => {
  const submit = (event) => {
    event.preventDefault()
    const { title, author, url } = event.target
    fieldRefs.forEach(x => x.current.clear())
    return submitBlog({ title: title.value, author: author.value, url: url.value })
  }
  const fieldRefs = [useRef(), useRef(), useRef()]
  return (
    <div>
      <form onSubmit={submit}>
        <TextField name='title' prompt='title: ' ref={fieldRefs[0]} />
        <TextField name='author' prompt='author: ' ref={fieldRefs[1]} />
        <TextField name='url' prompt='url: ' ref={fieldRefs[2]} />
        <input type='submit' />
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  submitBlog: PropTypes.func.isRequired,
}

const BlogList = ({ username, header, blogs, submitBlog, likeBlog, deleteBlog }) => {
  const formRef = useRef()
  const submit = (...args) => {
    formRef.current.toggleVisibility()
    return submitBlog(...args)
  }
  return (
    <div>
      {header}
      <div>
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
