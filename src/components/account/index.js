import actions from './actions'
import constants from './constants'
import selectors from './selectors'
import reducer from './reducer'

import CreateAccount from './CreateAccount'
import ConnectAccount from './ConnectAccount'
import Login from './Login'
import ResetPassword from './ResetPassword'
import SetPassword from './SetPassword'

const exports = {
  actions,
  constants,
  selectors,
  reducer,

  // components
  ConnectAccount,
  SetPassword,
}

export default exports
