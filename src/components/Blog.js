import {useState, useRef, useEffect} from 'react'

import Togglable from './Togglable'
import TextField from './TextField'

const Blog = ({blog, visible, doShow, doHide, doLike}) => {
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
  return (
  <div style={blogstyle}>
    <p> {blog.title} {blog.author} {toggleVisible}</p>
    <div style={{display: visible ? '' : 'none'}} >
    <p> {blog.url} </p>
    <p> likes: {blog.likes} <button onClick={doLike}> like </button> </p>
    <p> {blog.user.name} </p>
    </div>
  </div>

)}

const BlogForm = ({ submitBlog, ...prop }) => {
  const submit = (event) => {
    event.preventDefault()
    const {title, author, url} = event.target
    fieldRefs.forEach(x => x.current.clear())
    return submitBlog({title: title.value, author: author.value, url: url.value})
  }
  const fieldRefs = [useRef(), useRef(), useRef()]
  return (
    <div {...prop}>
      <form onSubmit={submit}>
        <TextField name='title' prompt='title: ' ref={fieldRefs[0]} />
        <TextField name='author' prompt='author: ' ref={fieldRefs[1]} />
        <TextField name='url' prompt='url: ' ref={fieldRefs[2]} />
        <input type='submit' />
      </form>
    </div>
  )
}



export const BlogList = ({header, blogs, submitBlog, likeBlog, ...props}) => {
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
    <div {...props}>
      {header}
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} visible={visibleState[blog.id]}
            doShow={() => setVisibleState({...visibleState, [blog.id]:true})}
            doHide={() => setVisibleState({...visibleState, [blog.id]:false})}
            doLike={() => likeBlog(blog)}
          />
        )}
      </div>
      <Togglable buttonLabel="create new blog" ref={formRef} style={{border:"solid", borderRadius:"15px", padding:"5px"}}>
        <BlogForm submitBlog={submit}/>
      </Togglable>

    </div>
  )
}

export default {Blog, BlogList}
