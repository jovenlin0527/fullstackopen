import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'

import axios from 'axios'

import BlogForm from './BlogForm'
import { setupStore } from '../store'
import { renderWithProviders } from '../utils/test_utils'

let blogFormComponent

beforeEach(() => {
  const store = setupStore()
  blogFormComponent = renderWithProviders(<BlogForm />, { store })
})

afterEach(() => {
  jest.resetAllMocks()
})

test('can submit a blog', async () => {
  const mockedAxios = jest.spyOn(axios, 'post')
  const { container } = blogFormComponent
  const titleField = container.querySelector("input[name='title']")
  const authorField = container.querySelector("input[name='author']")
  const urlField = container.querySelector("input[name='url']")
  const submit = container.querySelector("input[type='submit']")
  const user = userEvent.setup()
  await user.type(titleField, 'myTitle')
  await user.type(urlField, 'myUrl')
  await user.type(authorField, 'myAuthor')

  await user.click(submit)

  expect(mockedAxios).toHaveBeenCalled()
  const args = mockedAxios.mock.lastCall
  expect(args[0]).toBe('/api/blogs')
  expect(args[1]).toMatchObject({
    title: 'myTitle',
    url: 'myUrl',
    author: 'myAuthor',
  })
})
