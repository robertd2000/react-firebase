import { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { SIGN_IN } from '../../constants/routes'
import { withFirebase } from '../Firebase'
import AuthUserContext from './contex'

const withAuthorization = (condition) => (Component) => {
  const WithAuthorization = (props) => {
    useEffect(() => {
      props.firebase.auth.onAuthStateChanged((authUser) => {
        if (!condition(authUser)) {
          props.history.push(SIGN_IN)
        }
      })
    }, [])

    return (
      <AuthUserContext.Consumer>
        {(authUser) => {
          return condition(authUser) ? <Component {...props} /> : null
        }}
      </AuthUserContext.Consumer>
    )
  }

  return compose(withRouter, withFirebase)(WithAuthorization)
}

export default withAuthorization
