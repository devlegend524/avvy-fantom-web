import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/user',
  [
    'SET_DOMAINS', 
    'SET_DOMAIN_COUNT',
  ]
)

export default constants
