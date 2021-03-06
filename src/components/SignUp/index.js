import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { ADMIN } from '../../constants/roles'
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
  isAdmin: false,
  error: null,
}

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use'
const ERROR_MSG_ACCOUNT_EXISTS = `
An account with this E-Mail address already exists.
Try to login with this account instead. If you think the
account is already used from one of the social logins, try
to sign-in with one of them. Afterward, associate your accounts
on your personal account page.
`

const SignUpFormBase = ({ firebase, history }) => {
  const [state, setState] = useState(INITIAL_STATE)
  const { username, email, passwordOne, passwordTwo, error, isAdmin } = state

  const onSubmit = (e) => {
    e.preventDefault()
    const roles = []

    if (isAdmin) {
      roles.push(ADMIN)
    }
    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        return firebase.user(authUser.user.uid).set({
          username,
          email,
          roles,
        })
      })
      .then(() => {
        return firebase.doSendEmailVerification()
      })
      .then(() => {
        setState({ ...INITIAL_STATE })
        history.push(HOME)
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS
        }
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

  const onChangeCheckbox = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.checked,
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
        <label>
          Admin:
          <input
            name="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={onChangeCheckbox}
          />
        </label>
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

// import React, { Component } from 'react'
// import { Link, withRouter } from 'react-router-dom'

// import { withFirebase } from '../Firebase'
// import * as ROUTES from '../../constants/routes'

// const SignUpPage = () => (
//   <div>
//     <h1>SignUp</h1>
//     <SignUpForm />
//   </div>
// )

// const INITIAL_STATE = {
//   username: '',
//   email: '',
//   passwordOne: '',
//   passwordTwo: '',
//   error: null,
// }

// class SignUpFormBase extends Component {
//   constructor(props) {
//     super(props)

//     this.state = { ...INITIAL_STATE }
//   }

//   onSubmit = (event) => {
//     const { username, email, passwordOne } = this.state

//     this.props.firebase
//       .doCreateUserWithEmailAndPassword(email, passwordOne)
//       .then((authUser) => {
//         // Create a user in your Firebase realtime database
//         this.props.firebase
//           .user(authUser.user.uid)
//           .set({
//             username,
//             email,
//           })
//           .then(() => {
//             this.setState({ ...INITIAL_STATE })
//             this.props.history.push(ROUTES.HOME)
//           })
//           .catch((error) => {
//             this.setState({ error })
//           })
//       })
//       .catch((error) => {
//         this.setState({ error })
//       })

//     event.preventDefault()
//   }

//   onChange = (event) => {
//     this.setState({ [event.target.name]: event.target.value })
//   }

//   render() {
//     const { username, email, passwordOne, passwordTwo, error } = this.state

//     const isInvalid =
//       passwordOne !== passwordTwo ||
//       passwordOne === '' ||
//       email === '' ||
//       username === ''

//     return (
//       <form onSubmit={this.onSubmit}>
//         <input
//           name="username"
//           value={username}
//           onChange={this.onChange}
//           type="text"
//           placeholder="Full Name"
//         />
//         <input
//           name="email"
//           value={email}
//           onChange={this.onChange}
//           type="text"
//           placeholder="Email Address"
//         />
//         <input
//           name="passwordOne"
//           value={passwordOne}
//           onChange={this.onChange}
//           type="password"
//           placeholder="Password"
//         />
//         <input
//           name="passwordTwo"
//           value={passwordTwo}
//           onChange={this.onChange}
//           type="password"
//           placeholder="Confirm Password"
//         />
//         <button disabled={isInvalid} type="submit">
//           Sign Up
//         </button>

//         {error && <p>{error.message}</p>}
//       </form>
//     )
//   }
// }

// const SignUpLink = () => (
//   <p>
//     Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
//   </p>
// )

// const SignUpForm = withRouter(withFirebase(SignUpFormBase))

// export default SignUpPage

// export { SignUpForm, SignUpLink }
