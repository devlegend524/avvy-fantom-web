import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/namehash',
  [
    'ADD_RECORD',
  ]
)

export default constants
