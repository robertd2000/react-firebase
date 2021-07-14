import React from 'react'

import { withFirebase } from '../Firebase'

export const SignOutButtonBase = ({ firebase }) => {
  const clickHandle = () => {
    firebase.doSignOut()
  }
  return (
    <>
      {console.log(firebase)}

      <button type="button" onClick={clickHandle}>
        Sign Out
      </button>
    </>
  )
}

const SignOut = withFirebase(SignOutButtonBase)

export default SignOut
