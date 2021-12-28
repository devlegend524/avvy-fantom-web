import constants from './constants'

export const reducerName = 'registerView'

export const initialState = {
  pricingProofs: {},
  constraintsProofs: {},
  progress: {}
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
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
