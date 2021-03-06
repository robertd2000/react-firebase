import React from 'react'
import { Link } from 'react-router-dom'
import * as ROLES from '../../constants/roles'

import {
  ACCOUNT,
  ADMIN,
  HOME,
  LANDING,
  SIGN_IN,
  SIGN_UP,
} from '../../constants/routes'
import { AuthUserContext } from '../Session'
import SignOut from '../SignOut'
const Navigation = () => (
  <AuthUserContext.Consumer>
    {(authUser) =>
      authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>
)

const NavigationAuth = ({ authUser }) => {
  return (
    <ul>
      <li>
        <Link to={LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={HOME}>Home</Link>
      </li>
      <li>
        <Link to={ACCOUNT}>Account</Link>
      </li>
      {authUser && authUser.roles.includes(ROLES.ADMIN) && (
        <li>
          <Link to={ADMIN}>Admin</Link>
        </li>
      )}

      <li>
        <SignOut />
      </li>
    </ul>
  )
}

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={SIGN_IN}>Sign In</Link>
    </li>
  </ul>
)
export default Navigation
