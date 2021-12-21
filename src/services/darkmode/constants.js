import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/darkmode',
  [
    'SET_DARKMODE', 
  ]
)

console.log(constants)

export default constants
