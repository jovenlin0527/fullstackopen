import { createSlice } from '@reduxjs/toolkit'

const initialState = "Hi, this is a notifaction"


const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    pushNotification: (_state, action) => {
      return action.payload
    }
  }
})

export const { pushNotification } = notificationSlice.actions

export default notificationSlice.reducer
