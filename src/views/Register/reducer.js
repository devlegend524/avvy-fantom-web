import constants from './constants'

export const reducerName = 'registerView'

export const initialState = {
  commitHash: null,
  commitSalt: null,
  pricingProofs: {},
  constraintsProofs: {},
  progress: {},
  hasCommit: false,
  hasError: false,
  isComplete: false,
  isCommitting: false,
  isFinalizing: false,
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

    case constants.SET_HAS_COMMIT:
      return {
        ...state,
        hasCommit: action.value
      }

    case constants.SET_HAS_ERROR:
      return {
        ...state,
        hasError: action.value
      }

    case constants.SET_IS_COMPLETE:
      return {
        ...state,
        isComplete: action.value
      }

    case constants.SET_IS_COMMITTING:
      return {
        ...state,
        isCommitting: action.value
      }

    case constants.SET_IS_FINALIZING:
      return {
        ...state,
        isFinalizing: action.value
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
