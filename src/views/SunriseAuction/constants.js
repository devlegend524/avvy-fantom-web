import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'views/SunriseAuction',
  [
    'SET_AUCTION_PHASES',
    'SET_PROOF_PROGRESS',
    'SET_PRICING_PROOF',
    'SET_CONSTRAINTS_PROOF',
    'SET_HAS_BID_ERROR',
    'SET_BIDDING_IS_COMPLETE',
    'SET_BIDDING_IN_PROGRESS',
    'SET_REVEALING_BUNDLE',
    'SET_HAS_REVEAL_ERROR',
    'SET_AUCTION_RESULT',
    'SET_LOADING_WINNING_BIDS',
    'SET_AVAILABLE_WAVAX',
    'SET_APPROVED_WAVAX',
  ]
)

export default constants
