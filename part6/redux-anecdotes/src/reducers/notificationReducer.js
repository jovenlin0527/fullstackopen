import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(_state, action) {
      return action.payload
    },
    clearNotification(_state, _action) {
      return null
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export default notificationSlice.reducer
