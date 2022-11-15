import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import loginService from '../services/login'

const initialState = null

export const login = createAsyncThunk(
  'login/login',
  async ({ username, password }) => {
    const user = await loginService.login({ username, password })
    return user
  }
)

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser: (_state, action) => {
      return action.payload
    },
    logout: (_state, _action) => {
      return null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (_state, action) => {
      return action.payload
    })
  },
})

export const { setUser, logout } = loginSlice.actions
export const loginSelector = (state) => state.login
export const tokenSelector = (state) => state.login?.token
export default loginSlice.reducer
