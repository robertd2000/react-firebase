import React, { useEffect, useState } from 'react'
import { withFirebase } from '../Firebase'
import { compose } from 'recompose'
import { ADMIN as ADMIN_ROLE } from '../../constants/roles'
import { withAuthorization, withEmailVerification } from '../Session'
import { ADMIN_DETAILS, ADMIN } from '../../constants/routes'
import { Link, Route, Switch } from 'react-router-dom'

const AdminPage = () => (
  <div>
    <h1>Admin</h1>
    <p>The Admin Page is accessible by every signed in admin user.</p>
    <Switch>
      <Route exact path={ADMIN_DETAILS} component={UserItem} />
      <Route exact path={ADMIN} component={UserList} />
    </Switch>
  </div>
)

const UserListBase = ({ firebase }) => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    setLoading(true)
    const firebaseFunc = () => {
      firebase.users().on('value', (snapshot) => {
        const usersObject = snapshot.val()
        const usersList = Object.keys(usersObject).map((key) => ({
          ...usersObject[key],
          uid: key,
        }))

        setUsers(usersList)
        setLoading(false)
      })
    }

    firebaseFunc()
    return () => {
      firebase.users().off()
    }
  }, [])
  return (
    <div>
      <h1>Users: </h1>

      {loading && <div>Loading...</div>}

      <UsersList users={users} />
    </div>
  )
}

const UsersList = ({ users }) => {
  console.log(users)
  return (
    <ul>
      {users
        ? users.map((user) => (
            <li key={user.uid}>
              <span>
                <strong>ID:</strong> {user.uid}
              </span>
              <span>
                <strong>E-Mail:</strong> {user.email}
              </span>
              <span>
                <strong>Username:</strong> {user.username}
              </span>
              <span>
                {/* <Link to={`${ADMIN}/${user.uid}`}>Details</Link> */}
                <Link
                  to={{
                    pathname: `${ADMIN}/${user.uid}`,
                    state: { user },
                  }}
                >
                  Details
                </Link>
              </span>
            </li>
          ))
        : 'no data'}
    </ul>
  )
}

const UserItemBase = (props) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState(props.location.state)

  useEffect(() => {
    if (state) return
    setLoading(true)

    props.firebase.user(props.match.params.id).on('value', (snapshot) => {
      setUser(snapshot.val())
      setLoading(false)
    })

    return () => props.firebase.user(props.match.params.id).off()
  }, [])

  const onSendPasswordResetEmail = () => {
    props.firebase.doPasswordReset(user.email)
  }

  return (
    <div>
      <h2>User ({props.match.params.id})</h2>
      {loading && <div>Loading ...</div>}

      {user && (
        <div>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
          <span>
            <button type="button" onClick={onSendPasswordResetEmail}>
              Send Password Reset
            </button>
          </span>
        </div>
      )}
    </div>
  )
}

const condition = (authUser) => {
  return authUser && authUser.roles.includes(ADMIN_ROLE)
}

const UserList = withFirebase(UserListBase)
const UserItem = withFirebase(UserItemBase)
export default compose(
  withAuthorization(condition)
  // withEmailVerification
)(AdminPage)

// import React, { Component } from 'react'
// import { compose } from 'recompose'

// import { withFirebase } from '../Firebase'
// import { withAuthorization } from '../Session'
// import * as ROLES from '../../constants/roles'

// class AdminPage extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       loading: false,
//       users: [],
//     }
//   }

//   componentDidMount() {
//     this.setState({ loading: true })

//     this.props.firebase.users().on('value', (snapshot) => {
//       const usersObject = snapshot.val()

//       const usersList = Object.keys(usersObject).map((key) => ({
//         ...usersObject[key],
//         uid: key,
//       }))

//       this.setState({
//         users: usersList,
//         loading: false,
//       })
//     })
//   }

//   componentWillUnmount() {
//     this.props.firebase.users().off()
//   }

//   render() {
//     const { users, loading } = this.state

//     return (
//       <div>
//         <h1>Admin</h1>
//         <p>The Admin Page is accessible by every signed in admin user.</p>

//         {loading && <div>Loading ...</div>}

//         <UserList users={users} />
//       </div>
//     )
//   }
// }

// const UserList = ({ users }) => (
//   <ul>
//     {users.map((user) => (
//       <li key={user.uid}>
//         <span>
//           <strong>ID:</strong> {user.uid}
//         </span>
//         <span>
//           <strong>E-Mail:</strong> {user.email}
//         </span>
//         <span>
//           <strong>Username:</strong> {user.username}
//         </span>
//       </li>
//     ))}
//   </ul>
// )

// const condition = (authUser) => {
//   console.log(authUser)
//   return authUser && authUser.authUser
//     ? authUser?.authUser.roles?.includes(ROLES.ADMIN)
//     : authUser?.roles?.includes(ROLES.ADMIN)
// }

// export default compose(withAuthorization(condition), withFirebase)(AdminPage)
