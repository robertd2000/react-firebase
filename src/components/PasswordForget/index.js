import React, { useState } from 'react'
import { withFirebase } from '../Firebase'
import { PASSWORD_FORGET } from '../../constants/routes'
import { Link } from 'react-router-dom'
const PasswordForgetPage = () => (
  <div>
    <h1>Password forget</h1>
    <PasswordForgetForm />
  </div>
)

const INITIAL_STATE = {
  email: '',
  error: null,
}

const PasswordForgetFormBase = ({ firebase }) => {
  const [state, setState] = useState(INITIAL_STATE)

  const { email, error } = state
  const isInvalid = email === ''
  const onSubmit = (e) => {
    e.preventDefault()
    firebase
      .doPasswordReset(email)
      .then(() => {
        setState({
          ...INITIAL_STATE,
        })
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
    <form onSubmit={onSubmit}>
      <h2>{email}</h2>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <button type="submit" disabled={isInvalid}>
        Reset My Password
      </button>
      {error && <p>{error.message}</p>}
    </form>
  )
}

const PasswordForgetLink = () => (
  <p>
    <Link to={PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
)

const PasswordForgetForm = withFirebase(PasswordForgetFormBase)
export default PasswordForgetPage
export { PasswordForgetForm, PasswordForgetLink }
