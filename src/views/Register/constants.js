import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'views/Register',
  [
    'SET_HASH',
    'SET_SALT',
    'SET_PROGRESS',
    'SET_PRICING_PROOF',
    'SET_CONSTRAINTS_PROOF',
    'SET_HAS_COMMIT',
    'SET_HAS_ERROR',
    'SET_IS_COMPLETE',
    'SET_IS_COMMITTING',
    'SET_IS_FINALIZING',
  ]
)

export default constants
