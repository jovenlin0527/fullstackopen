import { useDispatch } from 'react-redux'

import { newAnecdote } from '../reducers/anecdoteReducer'
import { pushNotification, popNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()


  const createAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
    dispatch(newAnecdote(content))
    // TODO: Is this suitable place for notification?
    const msg = `You added ${content}`
    const notification = dispatch(pushNotification(msg)).payload
    setTimeout(() => dispatch(popNotification(notification)), 5000)
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
