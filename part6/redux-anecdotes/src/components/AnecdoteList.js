import { useSelector, useDispatch } from 'react-redux'
import sortBy from 'lodash.sortby'

import { voteId } from '../reducers/anecdoteReducer'
import { pushNotification, popNotification } from '../reducers/notificationReducer'

const AnecdoteItem = ({anecdote, vote}) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={vote}> vote </button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const anecdotes = state.anecdotes
    return sortBy(anecdotes, o => -o.votes)}
  )
  const dispatch = useDispatch()
  const vote = (anecdote) => {
    dispatch(voteId(anecdote.id))
    const notification = dispatch(pushNotification(`You voted for ${anecdote.content}`))
    setTimeout(() => {
      dispatch(popNotification(notification.payload))
    }, 5000)
  }
  return (
    <div>
      {anecdotes.map(anecdote =>
        <AnecdoteItem
          key={anecdote.id}
          vote={() => vote(anecdote)}
          anecdote={anecdote}
        />
      )}
    </div>
  )
}

export default AnecdoteList
