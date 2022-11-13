import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  let blogComponent
  const doLike = jest.fn()
  const doDelete = jest.fn()
  beforeEach(() => {
    blogComponent = render(
      <Blog blog={blog}
        doLike={doLike}
        doDelete={doDelete}
      />
    )
    blogComponent.queryTitle = () => blogComponent.queryByText(/TestBlogTitle/)
    blogComponent.queryAuthor = () => blogComponent.queryByText(/TestBlogAuthor/)
    blogComponent.queryUrl = () => blogComponent.queryByText(/TestBlogUrl/)
    blogComponent.queryLikes = () => blogComponent.queryByText(/likes.*238/)
  })

  test('Shows only title and author by default', () => {
    const title = blogComponent.queryTitle()
    expect(title).not.toBeNull()
    expect(title).toBeVisible()
    const author = blogComponent.queryAuthor()
    expect(author).not.toBeNull()
    expect(author).toBeVisible()

    const url = blogComponent.queryUrl()
    expect(url).not.toBeNull()
    expect(url).not.toBeVisible()
    const likes = blogComponent.queryLikes()
    expect(likes).not.toBeNull()
    expect(likes).not.toBeVisible()
  })

  test('Shows url and likes after clicking for details', async () => {
    const user = userEvent.setup()
    const { container } = blogComponent
    let toggleDetail = container.querySelector('.toggleBlogDetail')
    await user.click(toggleDetail)
    const url = blogComponent.queryUrl()
    const likes = blogComponent.queryLikes()
    expect(url).toBeVisible()
    expect(likes).toBeVisible()
    toggleDetail = container.querySelector('.toggleBlogDetail')
    await user.click(toggleDetail)
    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
  })

  test('Like button works', async () => {
    const user = userEvent.setup()
    const { container } = blogComponent
    let likeButton = container.querySelector('.likeBlog')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(doLike).toHaveBeenCalledTimes(2)
  })
})
