import constants from './constants'

export const reducerName = 'sunriseService'

export const initialState = {
  bids: {}, // bid amounts only, not necessarily submitted to the chain
  bidBundles: {}, // bids are submitted to the chain in bundles; this maps bids to bundles
  bundles: {}, // these are how the bids get submitted to the chain
  nameData: {},
  revealedBundles: {},
}

const rehydrate = (action, state) => {
  const payload = action.payload ? action.payload[reducerName] : null
  if (!payload) return initialState
  const nextState = {}
  for (let key in initialState) {
    if (payload[key]) nextState[key] = payload[key]
    else nextState[key] = initialState[key]
  }
  return nextState
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "persist/REHYDRATE":
      return rehydrate(action, state)
      
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

    case constants.ADD_BUNDLE:
      return {
        ...state,
        bundles: {
          ...state.bundles,
          [action.bundleHash]: action.bundle
        }
      }

    case constants.SET_BID_BUNDLE:
      return {
        ...state,
        bidBundles: {
          ...state.bidBundles,
          [action.name]: action.bundleHash
        }
      }

    case constants.REVEAL_BUNDLE:
      return {
        ...state,
        revealedBundles: {
          ...state.revealedBundles,
          [action.bundleHash]: true
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
