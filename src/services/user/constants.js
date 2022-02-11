import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/user',
  [
    'SET_DOMAIN_IDS',
    'SET_DOMAIN_COUNT',

    'SET_HAS_ACCOUNT',
    'SET_ACCOUNT_SIGNATURE',

    'SET_TOKEN', 
    'SET_LOGIN_ERROR',
    'SET_RESET_PASSWORD_RESULT',
    'SET_RESET_PASSWORD_LOADING',
    'SET_SET_PASSWORD_RESULT',
    'SET_SET_PASSWORD_ERROR',
    'SET_SET_PASSWORD_LOADING',

    'SET_VERIFY_WALLET_LOADING',
  ]
)

export default constants
