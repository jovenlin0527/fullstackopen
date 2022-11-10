import { connect } from 'react-redux'

import { newAnecdote } from '../reducers/anecdoteReducer'
import { sendNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (prop) => {
  const createAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
    prop.newAnecdote(content)
    const msg = `You added ${content}`
    prop.sendNotification(msg)
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

const mapDispatchToProps = {
  newAnecdote,
  sendNotification,
}

export default connect(
  null,
  mapDispatchToProps
)(AnecdoteForm)
