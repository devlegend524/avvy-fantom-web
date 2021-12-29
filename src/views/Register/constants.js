import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'views/Register',
  [
    'SET_HASH',
    'SET_SALT',
    'SET_PROGRESS',
    'SET_PRICING_PROOF',
    'SET_CONSTRAINTS_PROOF',
  ]
)

export default constants
