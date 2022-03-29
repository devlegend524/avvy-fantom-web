import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/cart',
  [
    'ADD_TO_CART',
    'ADD_BULK_REGISTRATIONS',
    'REMOVE_FROM_CART',
    'SET_QUANTITY',
    'SET_NAME_DATA',
    'IS_REFRESHING_NAME_DATA',
  ]
)

export default constants
