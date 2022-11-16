import { createListenerMiddleware } from '@reduxjs/toolkit'

import { notify, notifyError } from './reducers/notificationReducer'
import { login, setUser } from './reducers/loginReducer'
import {
  submitBlog,
  deleteBlog,
  blogsSelector,
  likeBlog,
} from './reducers/blogsReducer'

export const listeningMiddleware = createListenerMiddleware()

listeningMiddleware.startListening({
  actionCreator: setUser,
  effect: (action) => {
    const user = action.payload
    if (user != null) {
      window.localStorage.setItem('user', JSON.stringify(user))
    } else {
      window.localStorage.removeItem('user')
    }
  },
})

listeningMiddleware.startListening({
  actionCreator: login.fulfilled,
  effect: (action, { dispatch }) => {
    const user = action.payload
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

listeningMiddleware.startListening({
  actionCreator: deleteBlog.rejected,
  effect: (action, { dispatch }) => {
    const error = action.error
    dispatch(notifyError(`Cannot remove blog: ${error.message}`))
  },
})

listeningMiddleware.startListening({
  actionCreator: likeBlog.rejected,
  effect: (action, { dispatch }) => {
    const error = action.error
    dispatch(notifyError(`Cannot like blog: ${error.message}`))
  },
})

export default [listeningMiddleware.middleware]
