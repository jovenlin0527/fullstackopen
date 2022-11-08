import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = []


const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    pushNotification: {
      reducer: (state, action) => {
        state.push(action.payload)
      },
      prepare: (text) => {
        return {
          payload: {
            text,
            id: nanoid()
          }
        }
      }
    },
    popNotification: (state, action) => {
      return state.filter(n => n.id !== action.payload.id)
    }
  }
})

export const { pushNotification, popNotification } = notificationSlice.actions

export default notificationSlice.reducer
