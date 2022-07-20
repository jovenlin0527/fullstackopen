import axios from 'axios'
const baseUrl = '/api/login'

export class BadLogin extends Error {
}

export class UnexpectedResponseError extends Error {
  constructor(error, ...args) {
    super(`unexpected HTTP ${error.status} response :` + error.data, ...args)
  }

}

export const login = async (credentials) => {
  try {
    const response = await axios.post(baseUrl, credentials)
    if (response.status !== 200){
      throw new UnexpectedResponseError(response)
    }
    const data = response.data
    if (!('token' in data)) {
      throw new BadLogin('The server did not return the login token')
    }
    return data
  } catch (e) {
    if (e instanceof axios.AxiosError) {
      const response = e.response
      if (response.status === 401) {
        throw new BadLogin('Cannot login: ' + response.data.error)
      }
    }
    throw e
  }
}

export default { login, BadLogin }
