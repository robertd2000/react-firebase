import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { HOME } from '../../constants/routes'
import { withFirebase } from '../Firebase'
import { PasswordForgetLink } from '../PasswordForget'
import { SignUpLink } from '../SignUp'

const SignInPage = () => (
  <>
    <h1>Sign In</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </>
)

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
}

const SignInFormBase = ({ firebase, history }) => {
  const [state, setState] = useState(INITIAL_STATE)

  const { email, password, error } = state
  const isInvalid = password === '' || email === ''

  const onSubmit = (e) => {
    e.preventDefault()
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setState({ ...INITIAL_STATE })
        history.push(HOME)
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
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />

      <button type="submit" disabled={isInvalid}>
        Sign In
      </button>
      {error && <p>{error.message}</p>}
    </form>
  )
}

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase)

export default SignInPage
