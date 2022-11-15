import { configureStore, combineReducers, createListenerMiddleware } from '@reduxjs/toolkit'

import notificationReducer, { notify, notifyError } from './reducers/notificationReducer'
import loginReducer, { login, logout, setUser } from './reducers/loginReducer'

import blogService from './services/blogs'

const reducer = combineReducers({
  notification: notificationReducer,
  login: loginReducer,
})

const listeningMiddleware = createListenerMiddleware()

listeningMiddleware.startListening({
  actionCreator: login.fulfilled,
  effect: (action, { dispatch }) => {
    let user = action.payload
    window.localStorage.setItem('user', JSON.stringify(user))
		dispatch(notify(`Login success! Hello ${user.name}`))
  }
})

listeningMiddleware.startListening({
  actionCreator: login.rejected,
  effect: (action, { dispatch })  => {
    const errorMsg = action.error.message
    dispatch(notifyError(errorMsg))
  }
})

listeningMiddleware.startListening({
  actionCreator: logout,
  effect: (_action, { dispatch }) => {
    window.localStorage.removeItem('user')
    dispatch(notify('Logout success!'))
  }
})

// Inject user token into blogservice
// TODO: is there a better way to handle this?
listeningMiddleware.startListening({
  actionCreator: setUser,
  effect: (action, _listenerAPI ) => {
    let user = action.payload
    let token = user.token
    blogService.token = token
  }
})


export const setupStore = (preloadedState) =>
  configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(listeningMiddleware.middleware),
  })
