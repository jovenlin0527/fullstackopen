import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  id: 'TestBlogId',
  title: 'TestBlogTitle',
  author: 'TestBlogAuthor',
  url: 'TestBlogUrl',
  likes: 238,
  user: { username: 'username' }
}
describe('test default', () => {
  let container
  const doShow = jest.fn()
  const doHide = jest.fn()
  const doLike = jest.fn()
  const doDelete = jest.fn()
  beforeEach(() => {
    container = render(
      <Blog blog={blog}
        doShow={doShow}
        doHide={doHide}
        doLike={doLike}
        doDelete={doDelete}
      />
    )
  })
  test('Shows only title and author by default', () => {
    const title = container.queryByText(/TestBlogTitle/)
    expect(title).not.toBeNull()
    expect(title).toBeVisible()
    const author = container.queryByText(/TestBlogAuthor/)
    expect(author).not.toBeNull()
    expect(author).toBeVisible()

    const url = container.queryByText(/TestBlogUrl/)
    expect(url).not.toBeNull()
    expect(url).not.toBeVisible()
    const likes = container.queryByText(/likes.*238/)
    expect(likes).not.toBeNull()
    expect(likes).not.toBeVisible()

  })
})
