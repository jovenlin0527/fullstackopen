import { connect } from 'react-redux'

const Notification = (prop) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  const notification = prop.notification
  if (notification == null) {
    return null;
  }
  return (
    <div style={style}>
      { notification }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

export default connect(mapStateToProps)(Notification)
