import axios from 'axios'

class PostError extends Error {
}

const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = newToken
}

const post = async ({title, author, url, likes}) => {
  const config = {
    headers: {
      Authorization: 'bearer ' + token
    }
  }
  likes = likes ?? 0
  try {
    const response = await axios.post(baseUrl, {title, author, url, likes}, config)
    return response.data
  } catch (error) {
    const serverResponse = error?.response?.data?.error
    if (serverResponse) {
      throw new PostError(serverResponse)
    } else {
      throw error
    }
  }
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getAll , post, setToken, PostError}
