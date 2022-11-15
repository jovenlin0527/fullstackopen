import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import loginService from '../services/login'

const initialState = null

export const login = createAsyncThunk(
  'login/login',
  async ({ username, password }, { dispatch }) => {
    const user = await loginService.login({ username, password })
    dispatch(setUser(user))
    return user
  }
)

export const logout = () => {
  return (dispatch) => {
    dispatch({ type: 'login/logout' })
    return dispatch(setUser(null))
  }
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser: (_state, action) => {
      return action.payload
    },
  },
})

export const { setUser } = loginSlice.actions
export const loginSelector = (state) => state.login
export const tokenSelector = (state) => state.login?.token
export default loginSlice.reducer
