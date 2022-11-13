import React, { useState } from 'react'

import PropTypes from 'prop-types'

import './notification.css'

const BaseNotification = ({ message, className }) => {
  if (message == null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export const ShowNotification = ({ message }) => <BaseNotification className='notification-notice' message={message} />
export const ShowError = ({ message }) => <BaseNotification className='notification-error' message={message} />

ShowNotification.propTypes = {
  message: PropTypes.string.isRequired
}

ShowError.propTypes = {
  message: PropTypes.string.isRequired
}

export const useNotification = (timeout) => {
  timeout = typeof timeout === 'number' ? timeout : 5000
  const [notifications, setNotifications] = useState([])
  const [msgId, setId] = useState(0)
  const nextId = () => {
    const currentId = msgId
    setId(msgId + 1)
    return currentId
  }
  const pushImpl = (msg, isError) => {
    const newId = nextId()
    setNotifications(notifications.concat({ msg, isError, id : newId }))
    setTimeout(() => {
      setNotifications(notifications => notifications.filter(n => n.id !== newId))
    }, timeout)
  }

  const pushNotfication = msg => pushImpl(msg, false)

  const pushError = msg => pushImpl(msg, true)

  return [notifications, pushNotfication, pushError]
}

export const NotificationCenter = ({ notifications }) => (
  <div>
    {notifications.map(n =>
      <BaseNotification
        key={n.id}
        className = {n.isError ? 'notification-error' : 'notification-notice'}
        message={n.msg} />
    )}
  </div>
)

const NotificationType = PropTypes.exact({
  id: PropTypes.number.isRequired,
  isError: PropTypes.bool,
  msg: PropTypes.string.isRequired
})

NotificationCenter.propTypes = {
  notifications: PropTypes.arrayOf(NotificationType).isRequired
}

export default { ShowNotification, ShowError, useNotification, NotificationCenter }
