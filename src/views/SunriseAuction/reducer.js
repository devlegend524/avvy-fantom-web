import constants from './constants'

export const reducerName = 'SunriseAuctionView'

export const initialState = {
  auctionPhases: null,
}

export const reducer = (state = initialState, action) => {
  let index
  switch (action.type) {
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
