import axios from 'axios'

class BlogServiceError extends Error {}

const baseUrl = '/api/blogs'

const requestConfig = (token) => ({
  headers: {
    Authorization: 'bearer ' + token,
  },
})

const tryRequest = async (responsePromise) => {
  try {
    return await responsePromise
  } catch (error) {
    const getattr = (x, ...argname) => {
      for (const arg of argname) {
        x = x[arg]
        if (x == null) {
          return null
        }
      }
      return x
    }
    const serverResponse = getattr(error, 'response', 'data', 'error')
    if (serverResponse) {
      throw new BlogServiceError(serverResponse)
    } else {
      throw error
    }
  }
}

const post = async (token, { title, author, url, likes }) => {
  likes = typeof likes === 'number' ? likes : 0
  const response = await tryRequest(
    axios.post(baseUrl, { title, author, url, likes }, requestConfig(token))
  )
  return response.data
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const put = async (token, blog) => {
  const blogId = blog.id
  const blogToPut = { ...blog }
  if (typeof blogToPut.user !== 'string') {
    if (typeof blogToPut.user !== 'object') {
      throw new BlogServiceError(
        'Unexpected blog user type: ',
        typeof blogToPut.user
      )
    }
    const id = blogToPut.user.id
    if (typeof id !== 'string') {
      throw new BlogServiceError('Unexpected blog user id:', id)
    }
    blogToPut.user = id
  }
  const response = await tryRequest(
    axios.put(baseUrl + `/${blogId}`, blogToPut, requestConfig(token))
  )
  return response.data
}

const deleteBlog = async (token, blogId) => {
  return await tryRequest(
    axios.delete(baseUrl + `/${blogId}`, requestConfig(token))
  )
}

export default { getAll, post, put, BlogServiceError, deleteBlog }
