import { useSelector } from 'react-redux'

const NotificationItem = ({children}) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      { children }
    </div>
  )
}

const Notification = () => {
  const notification = useSelector(s => s.notification)
  return (
    notification.map(n => (
      <NotificationItem key={n.id}> {n.text} </NotificationItem>
    ))
  )

}

export default Notification
