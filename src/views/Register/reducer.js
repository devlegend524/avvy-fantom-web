import constants from './constants'

export const reducerName = 'registerView'

export const initialState = {
  commitHash: null,
  commitSalt: null,
  pricingProofs: {},
  constraintsProofs: {},
  progress: {}
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_SALT:
      return {
        ...state,
        commitSalt: action.salt
      }

    case constants.SET_HASH:
      return {
        ...state,
        commitHash: action.hash
      }

    case constants.SET_PROGRESS:
      return {
        ...state,
        progress: action.progress
      }

    case constants.SET_PRICING_PROOF:
      return {
        ...state,
        pricingProofs: {
          ...state.pricingProofs,
          [action.domain]: action.proof
        }
      }

    case constants.SET_CONSTRAINTS_PROOF:
      return {
        ...state,
        constraintsProofs: {
          ...state.constraintsProofs,
          [action.domain]: action.proof
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
