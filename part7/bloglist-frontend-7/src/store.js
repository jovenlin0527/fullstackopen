import {
  configureStore,
  combineReducers,
  createListenerMiddleware,
} from '@reduxjs/toolkit'

import notificationReducer, {
  notify,
  notifyError,
} from './reducers/notificationReducer'
import loginReducer, { login, setUser } from './reducers/loginReducer'

import blogsReducer, {
  submitBlog,
  deleteBlog,
  blogsSelector,
} from './reducers/blogsReducer'

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
    if (user != null) {
      window.localStorage.setItem('user', JSON.stringify(user))
    } else {
      window.localStorage.removeItem('user')
    }
    blogService.setToken(user?.token)
  },
})

listeningMiddleware.startListening({
  actionCreator: login.fulfilled,
  effect: (action, { dispatch }) => {
    let user = action.payload
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
  type: 'login/logout',
  effect: (_action, { dispatch }) => {
    dispatch(notify('Logout success!'))
  },
})

listeningMiddleware.startListening({
  actionCreator: submitBlog.fulfilled,
  effect: (action, { dispatch }) => {
    const { title, author } = action.payload
    dispatch(notify(`A new blog ${title} by ${author} is added`))
  },
})

listeningMiddleware.startListening({
  actionCreator: submitBlog.rejected,
  effect: (action, { dispatch }) => {
    const error = action.error
    dispatch(notifyError(error.message))
  },
})

listeningMiddleware.startListening({
  actionCreator: deleteBlog.fulfilled,
  effect: (action, { dispatch, getOriginalState }) => {
    const deletedId = action.payload
    const oldBlog = blogsSelector(getOriginalState()).find(
      ({ id }) => id === deletedId
    )
    dispatch(notify(`Removed ${oldBlog.title}`))
  },
})

export const setupStore = (preloadedState) =>
  configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(listeningMiddleware.middleware),
  })
