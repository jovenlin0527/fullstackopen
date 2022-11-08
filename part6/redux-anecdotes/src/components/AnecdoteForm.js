import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { newAnecdote, setAnecdotes } from '../reducers/anecdoteReducer'
import { pushNotification, popNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  // initialize, only run once
  useEffect(() => {
  anecdoteService
    .getAll()
    .then(anecdotes => dispatch(setAnecdotes(anecdotes)))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
         // effects with [] dependency only run once

  const createAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
    dispatch(newAnecdote(content))
    const msg = `You added ${content}`
    const action = dispatch(pushNotification(msg))
    setTimeout(() => dispatch(popNotification(action.payload)), 5000)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createAnecdote}>
        <div><input name="content" /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )

}

export default AnecdoteForm
