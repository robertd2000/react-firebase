import { useState } from 'react'
import { withFirebase } from '../Firebase/firebase'
import AuthUserContext from './contex'

const needsEmailVerification = (authUser) =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map((provider) => provider.providerId)
    .includes('password')

const withEmailVerification = (Component) => {
  const WithEmailVerification = (props) => {
    const [isSend, setIsSend] = useState(false)
    const onSendEmailVerification = () => {
      props.firebase.doSendEmailVerification().then(() => setIsSend(true))
    }

    return (
      <AuthUserContext.Consumer>
        {(authUser) => {
          needsEmailVerification(authUser) ? (
            <div>
              {isSend ? (
                <p>
                  E-Mail confirmation sent: Check you E-Mails (Spam folder
                  included) for a confirmation E-Mail. Refresh this page once
                  you confirmed your E-Mail.
                </p>
              ) : (
                <p>
                  Verify your E-Mail: Check you E-Mails (Spam folder included)
                  for a confirmation E-Mail or send another confirmation E-Mail.
                </p>
              )}

              <button
                type="button"
                onClick={onSendEmailVerification}
                disabled={isSend}
              >
                Send confirmation E-Mail
              </button>
            </div>
          ) : (
            <Component {...props} />
          )
        }}
      </AuthUserContext.Consumer>
    )
  }

  return withFirebase(WithEmailVerification)
}

export default withEmailVerification
