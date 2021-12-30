import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/names',
  [
    'ADD_RECORD',
  ]
)

export default constants
