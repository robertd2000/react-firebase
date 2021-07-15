import React, { useEffect, useState } from 'react'
import { withFirebase } from '../Firebase'
import { compose } from 'recompose'
import { ADMIN } from '../../constants/roles'
import { withAuthorization } from '../Session'

const AdminPage = ({ firebase }) => {
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
      <h1>Admin</h1>
      <p>The Admin Page is accessible by every signed in admin user.</p>
      {loading && <div>Loading...</div>}
      {console.log(users)}
      <UserList users={users} />
    </div>
  )
}

const UserList = ({ users }) => (
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
          </li>
        ))
      : 'no data'}
  </ul>
)

const condition = (authUser) => {
  console.log(authUser)
  return authUser && authUser.authUser
    ? authUser?.authUser.roles?.includes(ADMIN)
    : authUser?.roles?.includes(ADMIN)
}
export default compose(withAuthorization(condition), withFirebase)(AdminPage)

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
