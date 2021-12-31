import constants from './constants'

export const reducerName = 'myDomainsView'

export const initialState = {
  isLoading: false,
  domain: null,
  auctionPhases: null,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading
      }

    case constants.SET_DOMAIN:
      return {
        ...state,
        domain: action.domain
      }

    case constants.SET_AUCTION_PHASES:
      return {
        ...state,
        auctionPhases: action.auctionPhases
      }

    default:
      return state
  }
}

const exports = {
  reducer, 
  reducerName,
  initialState,
}

export default exports
