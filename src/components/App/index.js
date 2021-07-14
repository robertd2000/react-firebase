import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {
  ACCOUNT,
  ADMIN,
  HOME,
  LANDING,
  PASSWORD_FORGET,
  SIGN_IN,
  SIGN_UP,
} from '../../constants/routes'
import LandingPage from '../Landing'
import SignUpPage from '../SignUp'
import SignInPage from '../SignIn'
import PasswordForgetPage from '../PasswordForget'
import HomePage from '../Home'
import AccountPage from '../Account'
import AdminPage from '../Admin'

import Navigation from '../Navigation'
import { withAuthentication } from '../Session'

const App = () => {
  return (
    <Router>
      <Navigation />

      <hr />

      <Route exact path={LANDING} component={LandingPage} />
      <Route path={SIGN_UP} component={SignUpPage} />
      <Route path={SIGN_IN} component={SignInPage} />
      <Route path={PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={HOME} component={HomePage} />
      <Route path={ACCOUNT} component={AccountPage} />
      <Route path={ADMIN} component={AdminPage} />
    </Router>
  )
}

export default withAuthentication(App)
