import axios from 'axios'

const newId = () => (100000 * Math.random()).toFixed(0)

const baseUrl = 'http://localhost:3001/anecdotes/'

const getAll = () => axios.get(baseUrl).then(response => response.data)

const newAnecdote = async (content) => {
  const anecdote = {
    content,
    id: newId(),
    votes: 0
  }
  let response = await axios.post(baseUrl, anecdote)
  return response.data
}

export default { getAll, newAnecdote }
