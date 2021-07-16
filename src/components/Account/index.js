import React, { useEffect, useState } from 'react'
import { PasswordForgetForm } from '../PasswordForget'
import PasswordChangeForm from '../PasswordChange'
import { withAuthorization, AuthUserContext } from '../Session'
import { withFirebase } from '../Firebase'

const SIGN_IN_METHODS = [
  {
    id: 'password',
    provider: null,
  },
  {
    id: 'google.com',
    provider: 'googleProvider',
  },
  {
    id: 'facebook.com',
    provider: 'facebookProvider',
  },
  {
    id: 'twitter.com',
    provider: 'twitterProvider',
  },
]

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => {
      return (
        <div>
          <h1>Account: {authUser.email}</h1>
          <PasswordForgetForm />
          <PasswordChangeForm />
          <LoginManagement authUser={authUser} />
        </div>
      )
    }}
  </AuthUserContext.Consumer>
)

const LoginManagementBase = ({ firebase, authUser }) => {
  const [error, setError] = useState(null)
  const [activeSignInMethods, setActiveSignInMethods] = useState([])

  useEffect(() => {
    fetchSignInMethods()
  }, [])

  const fetchSignInMethods = () => {
    firebase.auth
      .fetchSignInMethodsForEmail(authUser.email)
      .then((activeSignInMethods) => {
        setActiveSignInMethods(activeSignInMethods)
        setError(null)
      })
      .catch((error) => setError(error))
  }

  const onSocialLoginLink = (provider) => {
    firebase.auth.currentUser
      .linkWithPopup(firebase[provider])
      .then(fetchSignInMethods)
      .catch((error) => setError(error))
  }

  const onUnlink = (providerId) => {
    firebase.auth.currentUser
      .unlink(providerId)
      .then(fetchSignInMethods)
      .catch((error) => setError(error))
  }

  const onDefaultLoginLink = (password) => {
    const credential = firebase.emailAuthProvider.credential(
      authUser.email,
      password
    )
    firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(fetchSignInMethods)
      .catch((error) => setError(error))
  }

  return (
    <div>
      Sign In Methods:
      <ul>
        {SIGN_IN_METHODS.map((signInMethod) => {
          const onlyOneLeft = activeSignInMethods.length === 1
          const isEnabled = activeSignInMethods.includes(signInMethod.id)
          return (
            <li key={signInMethod.id}>
              {signInMethod.id === 'password' ? (
                <DefaultLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onDefaultLoginLink}
                  onUnlink={onUnlink}
                />
              ) : (
                <SocialLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onSocialLoginLink}
                  onUnlink={onUnlink}
                />
              )}
            </li>
          )
        })}
      </ul>
      {error && error.message}
    </div>
  )
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) =>
  isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <button type="button" onClick={() => onLink(signInMethod.provider)}>
      Link {signInMethod.id}
    </button>
  )

const DefaultLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onUnlink,
  onLink,
}) => {
  const [state, setState] = useState({
    passwordOne: '',
    passwordTwo: '',
  })
  const { passwordOne, passwordTwo } = state

  const isInvalid = passwordOne !== passwordTwo || passwordOne === ''

  const onSubmit = (e) => {
    e.preventDefault()

    onLink(passwordOne)
    setState({
      passwordOne: '',
      passwordTwo: '',
    })
  }
  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    })
  }

  return isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <form onSubmit={onSubmit}>
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

      <button disabled={isInvalid} type="submit">
        Link {signInMethod.id}
      </button>
    </form>
  )
}

const LoginManagement = withFirebase(LoginManagementBase)

const condition = (authUser) => !!authUser

export default withAuthorization(condition)(AccountPage)
