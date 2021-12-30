import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'views/SunriseAuction',
  [
    'SET_AUCTION_PHASES',
  ]
)

export default constants
