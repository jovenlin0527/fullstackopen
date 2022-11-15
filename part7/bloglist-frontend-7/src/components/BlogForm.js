import PropTypes from 'prop-types'

import TextField, { useField } from './TextField'

const BlogForm = ({ submitBlog }) => {
  const [title, setTitle] = useField()
  const [author, setAuthor] = useField()
  const [url, setUrl] = useField()
  const submit = (event) => {
    event.preventDefault()
    const { title, author, url } = event.target.elements
    setTitle('')
    setAuthor('')
    setUrl('')
    return submitBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })
  }
  return (
    <div>
      <form className="blogForm" onSubmit={submit}>
        <TextField id="title" name="title" prompt="title: " {...title} />
        <TextField id="author" name="author" prompt="author: " {...author} />
        <TextField id="url" name="url" prompt="url: " {...url} />
        <input type="submit" />
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  submitBlog: PropTypes.func.isRequired,
}

export default BlogForm
