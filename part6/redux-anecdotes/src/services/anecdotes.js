import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes/'

const getAll = () => axios.get(baseUrl).then(response => response.data)

export default { getAll }
