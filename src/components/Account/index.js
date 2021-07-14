import React from 'react'
import { PasswordForgetForm } from '../PasswordForget'
import PasswordChangeForm from '../PasswordChange'
import { withAuthorization, AuthUserContext } from '../Session'
const AccountPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => {
      return (
        <div>
          <h1>Account: {authUser.authUser.email}</h1>
          <PasswordForgetForm />
          <PasswordChangeForm />
        </div>
      )
    }}
  </AuthUserContext.Consumer>
)

const condition = (authUser) => !!authUser

export default withAuthorization(condition)(AccountPage)
