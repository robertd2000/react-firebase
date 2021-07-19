import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../Session'
const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>

    <Messages />
  </div>
)

const MessagesBase = ({ firebase }) => {
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [limit, setLimit] = useState(5)

  useEffect(() => {
    onListenForMessages()

    return () => firebase.messages().off()
  }, [])

  const onListenForMessages = () => {
    setLoading(true)

    firebase
      .messages()
      .orderByChild('createdAt')
      .limitToLast(limit)
      .on('value', (snapshot) => {
        // setMessages()
        console.log('ggg')
        const messageObject = snapshot.val()

        if (messageObject) {
          const messageList = Object.keys(messageObject).map((key) => ({
            ...messageObject[key],
            uid: key,
          }))
          setMessages(messageList)

          setLoading(false)
        } else {
          setMessages(null)
          setLoading(false)
        }
      })
  }
  const onChangeText = (e) => {
    setText(e.target.value)
  }

  const onCreateMessage = (e, authUser) => {
    firebase.messages().push({
      text,
      userId: authUser.uid,
      createdAt: firebase.serverValue.TIMESTAMP,
    })

    setText('')
    e.preventDefault()
  }

  const onRemoveMessage = (uid) => {
    firebase.message(uid).remove()
  }

  const onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message

    firebase.message(uid).set({
      ...messageSnapshot,
      text,
      editedAt: firebase.serverValue.TIMESTAMP,
    })
  }

  const onNextPage = () => {
    setLimit(limit + 5)
    onListenForMessages()
  }

  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <div>
          {loading && <div>Loading ...</div>}
          {!loading && messages && (
            <button type="button" onClick={onNextPage}>
              More
            </button>
          )}

          {messages ? (
            <MessageList
              messages={messages}
              authUser={authUser}
              onRemoveMessage={onRemoveMessage}
              onEditMessage={onEditMessage}
            />
          ) : (
            <div>There are no messages ...</div>
          )}

          <form onSubmit={(e) => onCreateMessage(e, authUser)}>
            <input type="text" value={text} onChange={onChangeText} />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </AuthUserContext.Consumer>
  )
}

const MessageList = ({
  messages,
  onRemoveMessage,
  onEditMessage,
  authUser,
}) => (
  <ul>
    {messages.map((message) => (
      <MessageItem
        key={message.uid}
        message={message}
        onRemoveMessage={onRemoveMessage}
        onEditMessage={onEditMessage}
        authUser={authUser}
      />
    ))}
  </ul>
)
const MessageItem = ({ message, onRemoveMessage, onEditMessage, authUser }) => {
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState(message.text)

  const onToggleEditMode = () => {
    setEditMode(!editMode)
    setEditText(message.text)
  }

  const onChangeEditText = (e) => {
    setEditText(e.target.value)
  }

  const onSaveEditText = () => {
    onEditMessage(message, editText)
    setEditMode(false)
  }
  return (
    <li>
      {editMode ? (
        <input type="text" value={editText} onChange={onChangeEditText} />
      ) : (
        <span>
          <strong>{message.userId}</strong> {message.text}
          {message.editedAt && <span>(Edited)</span>}
        </span>
      )}

      {authUser.uid === message.userId && editMode ? (
        <span>
          <button onClick={onSaveEditText}>Save</button>
          <button onClick={onToggleEditMode}>Reset</button>
        </span>
      ) : (
        <button type="button" onClick={onToggleEditMode}>
          Edit
        </button>
      )}
      {!editMode && (
        <button type="button" onClick={() => onRemoveMessage(message.uid)}>
          Delete
        </button>
      )}
    </li>
  )
}

const Messages = withFirebase(MessagesBase)

const condition = (authUser) => !!authUser

export default compose(
  // withEmailVerification,
  withAuthorization(condition)
)(HomePage)
