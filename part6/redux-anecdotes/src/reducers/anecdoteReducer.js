import { createSlice } from '@reduxjs/toolkit'

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
    newAnecdote: (state, action) => {
      state.push(action.payload)
    },
    setAnecdotes: (_state, action) => {
      return action.payload
    }
  }
})

export const { voteId, newAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
