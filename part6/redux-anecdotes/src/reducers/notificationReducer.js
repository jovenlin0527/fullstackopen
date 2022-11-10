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

export const sendNotification = (msg) => {
  return (dispatch, getState) => {
    const oldNotification = getState().notification
    if (oldNotification != null) {
      clearTimeout(oldNotification.timeoutId)
    }
    const timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
    dispatch(setNotification({
      msg, timeoutId
    }))
  }
}

export default notificationSlice.reducer
