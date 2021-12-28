import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'views/Register',
  [
    'SET_PROGRESS',
    'SET_PRICING_PROOF',
  ]
)

export default constants
