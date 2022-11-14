import { configureStore, combineReducers } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'

const reducer = combineReducers({
  notification: notificationReducer,
})

export const setupStore = (preloadedState) =>
  configureStore({ reducer, preloadedState })
