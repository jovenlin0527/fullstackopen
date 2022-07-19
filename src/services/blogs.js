import axios from 'axios'

class BlogServiceError extends Error {
}

const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = newToken
}

const requestConfig = () => ({
  headers: {
    Authorization: 'bearer ' + token,
  }
})

const tryRequest = async (responsePromise) => {
  try {
    return await responsePromise
  } catch (error) {
    const serverResponse = error?.response?.data?.error
    if (serverResponse) {
      throw new BlogServiceError(serverResponse)
    } else {
      throw error
    }
  }

}

const post = async ({title, author, url, likes}) => {
  likes = likes ?? 0
  const response = await tryRequest(axios.post(baseUrl, {title, author, url, likes}, requestConfig()))
  return response.data
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const put = async (id, blog) => {
  const blogToPut = {...blog}
  if (typeof blogToPut.user !== 'string') {
    if (typeof blogToPut.user !== 'object') {
      throw new BlogServiceError('Unexpected blog user type: ', typeof blogToPut.user)
    }
    const id = blogToPut.user.id
    if (typeof id !== 'string') {
      throw new BlogServiceError('Unexpected blog user id:', id)
    }
    blogToPut.user = id
  }
  const response = await tryRequest(axios.put(baseUrl + `/${id}`, blogToPut, requestConfig()))
  return response.data
}


export default { getAll , post, put, setToken, BlogServiceError}
