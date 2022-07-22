import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './BlogForm'

let blogFormComponent
let submitBlog = jest.fn()
beforeEach(() => {
  blogFormComponent = render( <BlogForm submitBlog={submitBlog} /> )
})

test('can submit a blog', async () => {
  const { container } = blogFormComponent
  const titleField = container.querySelector("input[name='title']")
  const authorField = container.querySelector("input[name='author']")
  const urlField = container.querySelector("input[name='url']")
  const submit = container.querySelector("input[type='submit']")
  console.log(submit)
  const user = userEvent.setup()
  await user.type(titleField, 'myTitle'),
  await user.type(urlField, 'myUrl'),
  await user.type(authorField, 'myAuthor')
  console.log('before click')
  await user.click(submit)
  console.log('after click')
})

