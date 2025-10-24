import './MessageBox.css'

function MessageBox({ message, type, show }) {
  return (
    <div className={`message-box ${show ? 'show' : ''} ${type}`}>
      {message}
    </div>
  )
}

export default MessageBox