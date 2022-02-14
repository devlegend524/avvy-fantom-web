import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'components/account',
  [
    'SET_LOGIN_ERROR',
    'SET_IS_LOGGING_IN',

    'SET_RESET_PASSWORD_RESULT',
    'SET_RESET_PASSWORD_LOADING',

    'SET_SET_PASSWORD_RESULT',
    'SET_SET_PASSWORD_ERROR',
    'SET_SET_PASSWORD_LOADING',
  ]
)

export default constants
