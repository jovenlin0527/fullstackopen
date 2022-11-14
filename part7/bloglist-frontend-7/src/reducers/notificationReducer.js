import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = []

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.push(action.payload)
    },
    removeNotification: (state, action) => {
      const idToRemove = action.payload
      return state.filter(({ id }) => id !== idToRemove)
    },
  },
})

const { addNotification, removeNotification } = notificationSlice.actions

const notifyImpl = (msg, timeout, isError) => {
  return (dispatch) => {
    const id = nanoid()
    setTimeout(() => {
      dispatch(removeNotification(id))
    }, timeout)
    dispatch(addNotification({ msg, isError, id }))
  }
}

export const notify = (msg, timeout = 5000) => notifyImpl(msg, timeout, false)
export const notifyError = (msg, timeout = 5000) => notifyImpl(msg, timeout, true)
export const selectNotifications = (state) => state.notification
export default notificationSlice.reducer
