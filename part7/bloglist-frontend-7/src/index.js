import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { setupStore } from './store'

const initialState = (() => {
  let ret = {}
  let user = window.localStorage.getItem('user')
  if (user) {
    ret.login = JSON.parse(user)
  }
  return ret
})()

const store = setupStore(initialState)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
