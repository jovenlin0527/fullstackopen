import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: "anecdote",
  initialState: [],
  reducers: {
    updateAnecdote: (state, action) => {
      const newNote = action.payload
      return state.map(note => note.id !== newNote.id ? note : newNote)
    },
    addAnecdote: (state, action) => {
      state.push(action.payload)
    },
    setAnecdotes: (_state, action) => {
      return action.payload
    }
  }
})

export const { updateAnecdote, addAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const newAnecdote = (content) => {
  return async dispatch => {
    const anecdote = await anecdoteService.newAnecdote(content)
    dispatch(addAnecdote(anecdote))

  }
}

export const voteAnecdote = ({id, votes}) => {
  return async (dispatch) => {
    const updated = await anecdoteService.patch(id, {votes: votes + 1})
    dispatch(updateAnecdote(updated))
  }
}

export default anecdoteSlice.reducer
