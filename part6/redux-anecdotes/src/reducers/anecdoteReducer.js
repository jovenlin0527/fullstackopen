import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: "anecdote",
  initialState: [],
  reducers: {
    voteId: (state, action) => {
      const id = action.payload
      return state.map(note =>
        note.id !== id
        ? note
        : { ...note, votes: note.votes + 1 }
      )
    },
    addAnecdote: (state, action) => {
      state.push(action.payload)
    },
    setAnecdotes: (_state, action) => {
      return action.payload
    }
  }
})

export const { voteId, addAnecdote, setAnecdotes } = anecdoteSlice.actions

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

export default anecdoteSlice.reducer
