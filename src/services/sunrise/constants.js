import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/sunrise',
  [
    'ADD_BID',
    'DELETE_BID',
    'SET_NAME_DATA',
    'ADD_BUNDLE',
    'SET_BID_BUNDLE',
    'REVEAL_BUNDLE',
  ]
)

export default constants
