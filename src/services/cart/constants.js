import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/cart',
  [
    'ADD_TO_CART',
    'REMOVE_FROM_CART',
    'SET_QUANTITY',
    'SET_NAME_DATA',
  ]
)

export default constants
