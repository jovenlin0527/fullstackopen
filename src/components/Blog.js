import {useState, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'

import Togglable from './Togglable'
import TextField from './TextField'

const BlogType = PropTypes.exact({
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
})

const Blog = ({blog, visible, doShow, doHide, doLike, doDelete}) => {
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
    <div style={{display: visible ? '' : 'none'}} >
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


const BlogForm = ({ submitBlog }) => {
  const submit = (event) => {
    event.preventDefault()
    const {title, author, url} = event.target
    fieldRefs.forEach(x => x.current.clear())
    return submitBlog({title: title.value, author: author.value, url: url.value})
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



export const BlogList = ({username, header, blogs, submitBlog, likeBlog, deleteBlog}) => {
  const [visibleState, setVisibleState] = useState({})
  useEffect(() => {
    const newVisibleState = {...visibleState}
    for (const b of blogs) {
      if (!(b.id in visibleState)) {
        newVisibleState[b.id] = true
      }
    }
    setVisibleState(newVisibleState)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogs])
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
          <Blog key={blog.id} blog={blog} visible={visibleState[blog.id]}
            doShow={() => setVisibleState({...visibleState, [blog.id]:true})}
            doHide={() => setVisibleState({...visibleState, [blog.id]:false})}
            doLike={() => likeBlog(blog)}
            doDelete={ username === blog.user.username ? () => {deleteBlog(blog)} : null }
          />
        )}
      </div>
      <Togglable buttonLabel="create new blog" ref={formRef} style={{border:"solid", borderRadius:"15px", padding:"5px"}}>
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

export default {Blog, BlogList}
