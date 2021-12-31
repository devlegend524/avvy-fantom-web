import constants from './constants'

export const reducerName = 'sunriseService'

export const initialState = {
  bids: {},
  nameData: {},
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ADD_BID:
      return {
        ...state,
        bids: {
          ...state.bids,
          [action.domain]: action.amount
        }
      }

    case constants.DELETE_BID:
      return {
        ...state,
        bids: Object.fromEntries(
          Object.entries(state.bids)
          .filter(([key, val]) => key !== action.domain)
        )
      }

    case constants.SET_NAME_DATA:
      return {
        ...state,
        nameData: {
          ...state.nameData,
          [action.name]: action.data
        }
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
