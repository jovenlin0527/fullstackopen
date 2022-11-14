import React from 'react'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import { selectNotifications } from '../reducers/notificationReducer'

import './notification.css'

const BaseNotification = ({ message, className }) => {
  if (message == null) {
    return null
  }

  return (
    <div data-testid="notificationItem" className={className}>
      {message}
    </div>
  )
}

export const ShowNotification = ({ message }) => (
  <BaseNotification className="notification-notice" message={message} />
)
export const ShowError = ({ message }) => (
  <BaseNotification className="notification-error" message={message} />
)

ShowNotification.propTypes = {
  message: PropTypes.string.isRequired,
}

ShowError.propTypes = {
  message: PropTypes.string.isRequired,
}

export const NotificationCenter = () => {
  const notifications = useSelector(selectNotifications)
  return (
    <div>
      {notifications.map((n) => (
        <BaseNotification
          key={n.id}
          className={n.isError ? 'notification-error' : 'notification-notice'}
          message={n.msg}
        />
      ))}
    </div>
  )
}

NotificationCenter.propTypes = {}

export default {
  ShowNotification,
  ShowError,
  NotificationCenter,
}
