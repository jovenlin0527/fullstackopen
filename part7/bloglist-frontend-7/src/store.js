import { configureStore, combineReducers } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'

// TODO: Add listener middleware for login/logout notification

const reducer = combineReducers({
  notification: notificationReducer,
  login: loginReducer,
})

export const setupStore = (preloadedState) =>
  configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  })
