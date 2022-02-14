import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/user',
  [
    'SET_DOMAIN_IDS',
    'SET_DOMAIN_COUNT',

    'SET_HAS_ACCOUNT',
    'SET_ACCOUNT_SIGNATURE',

    'SET_TOKEN', 

    'SET_VERIFY_WALLET_LOADING',
  ]
)

export default constants
