import React, { useEffect, useState } from 'react'

import { withFirebase } from '../Firebase'

import AuthUserContext from './contex'

const withAuthentication = (Component) => {
  const WithAuthentication = (props) => {
    const [authUser, setAuthUser] = useState(null)
    useEffect(() => {
      const listener = props.firebase.onAuthUserListener(
        (authUser) => {
          setAuthUser(authUser)
        },
        () => {
          setAuthUser(null)
        }
      )

      return () => listener()
    }, [])

    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    )
  }

  return withFirebase(WithAuthentication)
}

// const withAuthentication = (Component) => {
//   class withAuthentication extends React.Component {
//     constructor(props) {
//       super(props)

//       this.state = {
//         authUser: null,
//       }
//     }

//     componentDidMount() {
//       this.listener = this.props.firebase.auth.onAuthStateChanged(
//         (authUser) => {
//           authUser
//             ? this.setState({ authUser })
//             : this.setState({ authUser: null })
//         }
//       )
//     }

//     componentWillUnmount() {
//       this.listener()
//     }
//     render() {
//   return (
//     <AuthUserContext.Provider value={this.state.authUser}>
//       <Component {...this.props} />
//     </AuthUserContext.Provider>
//   )
//     }
//   }
//   return withFirebase(WithAuthentication)
// }
export default withAuthentication
