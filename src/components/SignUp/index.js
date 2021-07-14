import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { HOME, SIGN_UP } from '../../constants/routes'
import { withFirebase } from '../Firebase/firebase'
const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
    <SignUpLink />
  </div>
)

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
}

const SignUpFormBase = ({ firebase, history }) => {
  const [state, setState] = useState(INITIAL_STATE)
  const { username, email, passwordOne, passwordTwo, error } = state

  const onSubmit = (e) => {
    e.preventDefault()
    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        setState({ ...INITIAL_STATE })
        history.push(HOME)
      })
      .catch((error) => {
        setState({
          ...state,
          error: error,
        })
      })
  }

  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    })
  }
  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === ''

  return (
    <>
      <h2>{username}</h2>
      <h2>{email}</h2>
      <h2>{passwordOne}</h2>
      <h2>{passwordTwo}</h2>

      <form onSubmit={onSubmit}>
        <input
          name="username"
          value={username}
          onChange={onChange}
          type="text"
          placeholder="Full Name"
        />
        <input
          name="email"
          value={email}
          onChange={onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={onChange}
          type="password"
          placeholder="Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <button type="submit" disabled={isInvalid}>
          Sign Up
        </button>
        {error && <p>{error.message}</p>}
      </form>
    </>
  )
}

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase)

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={SIGN_UP}>Sign Up</Link>
  </p>
)

export default SignUpPage

export { SignUpForm, SignUpLink }
