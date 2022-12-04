import { createSlice , createAsyncThunk } from '@reduxjs/toolkit'

import usersService from '../services/users'

const initialState = null

export const getUsers = createAsyncThunk(
  'users/getUsers',
  async () => {
    const response = await usersService.getAll()
    return response
  }
)

const usersSlice = createSlice( {
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (_state , action) => {
      return action.payload
    })
  }
})

export const usersSelector = (state) => state.users
export default usersSlice.reducer
