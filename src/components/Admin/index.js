import React, { useEffect, useState } from 'react'
import { withFirebase } from '../Firebase'
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

      {loading && <div>Loading...</div>}

      <UserList users={users} />
    </div>
  )
}

const UserList = ({ users }) => (
  <ul>
    {users.map((user) => (
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
    ))}
  </ul>
)

export default withFirebase(AdminPage)

// import React, { Component } from 'react'

// import { withFirebase } from '../Firebase'

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

//     console.log(users)

//     return (
//       <div>
//         <h1>Admin</h1>

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

// export default withFirebase(AdminPage)
