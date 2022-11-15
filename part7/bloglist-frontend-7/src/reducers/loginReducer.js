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
    setUser(_state, action) {
      return action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (_state, action) => {
      return action.payload
    })
  },
})

const { setUser } = loginSlice.actions

export const logout = () => setUser(null)
export const loginSelector = (state) => state.login
export default loginSlice.reducer
