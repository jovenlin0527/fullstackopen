import {
  configureStore,
  combineReducers,
  createListenerMiddleware,
} from '@reduxjs/toolkit'

import notificationReducer, {
  notify,
  notifyError,
} from './reducers/notificationReducer'
import loginReducer, { login, logout, setUser } from './reducers/loginReducer'
import blogsReducer from './reducers/blogsReducer'

import blogService from './services/blogs'

const reducer = combineReducers({
  blogs: blogsReducer,
  notification: notificationReducer,
  login: loginReducer,
})

const listeningMiddleware = createListenerMiddleware()

listeningMiddleware.startListening({
  actionCreator: setUser,
  effect: (action) => {
    let user = action.payload
    blogService.setToken(user.token)
  },
})

listeningMiddleware.startListening({
  actionCreator: login.fulfilled,
  effect: (action, { dispatch }) => {
    let user = action.payload
    window.localStorage.setItem('user', JSON.stringify(user))
    blogService.setToken(user.token)
    dispatch(notify(`Login success! Hello ${user.name}`))
  },
})

listeningMiddleware.startListening({
  actionCreator: login.rejected,
  effect: (action, { dispatch }) => {
    const errorMsg = action.error.message
    dispatch(notifyError(errorMsg))
  },
})

listeningMiddleware.startListening({
  actionCreator: logout,
  effect: (_action, { dispatch }) => {
    window.localStorage.removeItem('user')
    blogService.token = null
    dispatch(notify('Logout success!'))
  },
})

export const setupStore = (preloadedState) =>
  configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(listeningMiddleware.middleware),
  })
