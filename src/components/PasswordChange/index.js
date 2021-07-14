import React, { useState } from 'react'
import { withFirebase } from '../Firebase'

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
}

const PasswordChangeForm = ({ firebase }) => {
  const [state, setState] = useState(INITIAL_STATE)

  const { passwordOne, passwordTwo, error } = state

  const isInvalid = passwordOne !== passwordTwo || passwordOne === ''

  const onSubmit = (e) => {
    e.preventDefault()
    firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        setState({ ...INITIAL_STATE })
      })
      .catch((error) => setState({ ...state, error }))
  }

  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    })
  }
  return (
    <form>
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="New Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm New Password"
      />
      <button type="submit" disabled={isInvalid}>
        Reset My Password
      </button>
      {error && <p>{error.message}</p>}
    </form>
  )
}

export default withFirebase(PasswordChangeForm)
