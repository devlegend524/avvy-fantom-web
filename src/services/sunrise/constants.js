import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/sunrise',
  [
    'ADD_BID',
    'DELETE_BID',
    'SET_NAME_DATA',
  ]
)

export default constants
