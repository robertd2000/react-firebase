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
    <SignInGoogleBase />
    <SignInFacebook />
    <SignInTwitter />
    <PasswordForgetLink />
    <SignUpLink />
  </>
)

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
}

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential'
const ERROR_MSG_ACCOUNT_EXISTS = `
An account with an E-Mail address to
this social account already exists. Try to login from
this account instead and associate your social accounts on
your personal account page.
`

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

const SignInGoogleBase = ({ firebase, history }) => {
  const [error, setError] = useState(null)

  const onSubmit = (e) => {
    e.preventDefault()

    firebase
      .doSignInWithGoogle()
      .then((socialAuthUser) => {
        return firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: [],
        })
      })
      .then(() => {
        setError(null)
        history.push(HOME)
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS
        }
        setError(error)
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Google</button>

      {error && <p>{error.message}</p>}
    </form>
  )
}

const SignInFacebookBase = ({ firebase, history }) => {
  const [error, setError] = useState(null)

  const onSubmit = (e) => {
    e.preventDefault()

    firebase
      .doSignInWithFacebook()
      .then((socialAuthUser) => {
        return firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: [],
        })
      })
      .then(() => {
        setError(null)
        history.push(HOME)
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS
        }
        setError(error)
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Facebook</button>

      {error && <p>{error.message}</p>}
    </form>
  )
}

const SignInTwitterBase = ({ firebase, history }) => {
  const [error, setError] = useState(null)

  const onSubmit = (e) => {
    e.preventDefault()

    firebase
      .doSignInWithTwitter()
      .then((socialAuthUser) => {
        return firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: [],
        })
      })
      .then(() => {
        setError(null)
        history.push(HOME)
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS
        }
        setError(error)
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Twitter</button>

      {error && <p>{error.message}</p>}
    </form>
  )
}

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase)

const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase)

const SignInFacebook = compose(withRouter, withFirebase)(SignInFacebookBase)

const SignInTwitter = compose(withRouter, withFirebase)(SignInTwitterBase)
export default SignInPage

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter }
