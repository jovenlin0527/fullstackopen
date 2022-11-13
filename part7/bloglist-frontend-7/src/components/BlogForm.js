import { useRef } from 'react'
import PropTypes from 'prop-types'

import TextField from './TextField'


const BlogForm = ({ submitBlog }) => {
  const submit = (event) => {
    event.preventDefault()
    const { title, author, url } = event.target.elements
    fieldRefs.forEach(x => x.current.clear())
    return submitBlog({ title: title.value, author: author.value, url: url.value })
  }
  const fieldRefs = [useRef(), useRef(), useRef()]
  return (
    <div>
      <form className='blogForm' onSubmit={submit}>
        <TextField id='title' name='title' prompt='title: ' ref={fieldRefs[0]} />
        <TextField id='author' name='author' prompt='author: ' ref={fieldRefs[1]} />
        <TextField id='url' name='url' prompt='url: ' ref={fieldRefs[2]} />
        <input type='submit' />
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  submitBlog: PropTypes.func.isRequired,
}

export default BlogForm
