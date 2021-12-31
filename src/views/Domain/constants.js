import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'views/MyDomains',
  [
    'SET_DOMAIN',
    'SET_LOADING', 
    'SET_AUCTION_PHASES',
  ]
)

export default constants
