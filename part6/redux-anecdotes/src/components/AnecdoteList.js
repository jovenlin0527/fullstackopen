import { useSelector, useDispatch } from 'react-redux'
import sortBy from 'lodash.sortby'

import { voteId } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const anecdotes = state.anecdotes
    return sortBy(anecdotes, o => -o.votes)}
  )
  const dispatch = useDispatch()
  const vote = (id) => {
    dispatch(voteId(id))
  }
  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
