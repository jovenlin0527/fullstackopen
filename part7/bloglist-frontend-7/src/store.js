import { configureStore, combineReducers } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import blogsReducer from './reducers/blogsReducer'
import usersReducer from './reducers/usersReducer'

import middlewares from './middlewares'

const reducer = combineReducers({
  blogs: blogsReducer,
  notification: notificationReducer,
  login: loginReducer,
  users: usersReducer,
})

export const setupStore = (preloadedState) =>
  configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middlewares),
  })
