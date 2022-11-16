import { configureStore, combineReducers } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import blogsReducer from './reducers/blogsReducer'

import middlewares from './middlewares'

const reducer = combineReducers({
  blogs: blogsReducer,
  notification: notificationReducer,
  login: loginReducer,
})

export const setupStore = (preloadedState) =>
  configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middlewares),
  })
