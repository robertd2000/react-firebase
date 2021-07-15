import { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { SIGN_IN } from '../../constants/routes'
import { withFirebase } from '../Firebase'
import AuthUserContext from './contex'

const withAuthorization = (condition) => (Component) => {
  const WithAuthorization = (props) => {
    useEffect(() => {
      const listener = props.firebase.onAuthUserListener(
        (authUser) => {
          if (!condition(authUser)) {
            props.history.push(SIGN_IN)
          }
        },
        () => {
          props.history.push(SIGN_IN)
        }
      )
      return () => listener()
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

// import React from 'react'
// import { withRouter } from 'react-router-dom'
// import { compose } from 'recompose'

// import AuthUserContext from './contex'
// import { withFirebase } from '../Firebase'
// import * as ROUTES from '../../constants/routes'

// const withAuthorization = (condition) => (Component) => {
//   class WithAuthorization extends React.Component {
//     componentDidMount() {
//       this.listener = this.props.firebase.onAuthUserListener(
//         (authUser) => {
//           console.log(authUser)
//           if (!condition(authUser)) {
//             this.props.history.push(ROUTES.SIGN_IN)
//           }
//         },
//         () => this.props.history.push(ROUTES.SIGN_IN)
//       )
//     }

//     componentWillUnmount() {
//       this.listener()
//     }

//     render() {
//       return (
//         <AuthUserContext.Consumer>
//           {(authUser) =>
//             condition(authUser) ? <Component {...this.props} /> : null
//           }
//         </AuthUserContext.Consumer>
//       )
//     }
//   }

//   return compose(withRouter, withFirebase)(WithAuthorization)
// }

// export default withAuthorization
