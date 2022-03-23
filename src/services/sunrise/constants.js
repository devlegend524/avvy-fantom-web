import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/sunrise',
  [
    'ADD_BID',
    'BULK_ADD_BIDS',
    'DELETE_BID',
    'SET_NAME_DATA',
    'SET_ALL_NAME_DATA',
    'SET_NAME_DATA_PROGRESS',
    'ADD_BUNDLE',
    'SET_BID_BUNDLE',
    'REVEAL_BUNDLE',
    'SET_CONSTRAINTS_PROOF',
    'SET_CLAIMED',
  ]
)

export default constants
