import { useRef } from 'react'
import { useDispatch } from 'react-redux'

import TextField, { useField } from './TextField'
import Togglable from './Togglable'
import { submitBlog } from '../reducers/blogsReducer'

const BlogForm = () => {
  const dispatch = useDispatch()
  const [title, setTitle] = useField()
  const [author, setAuthor] = useField()
  const [url, setUrl] = useField()
  const formRef = useRef()
  const submit = (event) => {
    event.preventDefault()
    const { title, author, url } = event.target.elements
    setTitle('')
    setAuthor('')
    setUrl('')
    formRef.current.toggleVisibility()
    dispatch(
      submitBlog({
        title: title.value,
        author: author.value,
        url: url.value,
      })
    )
  }
  return (
    <Togglable
      buttonLabel="create new blog"
      ref={formRef}
      style={{ border: 'solid', borderRadius: '15px', padding: '5px' }}
    >
      <form className="blogForm" onSubmit={submit}>
        <TextField id="title" name="title" prompt="title: " {...title} />
        <TextField id="author" name="author" prompt="author: " {...author} />
        <TextField id="url" name="url" prompt="url: " {...url} />
        <input type="submit" />
      </form>
    </Togglable>
  )
}

BlogForm.propTypes = {}

export default BlogForm
