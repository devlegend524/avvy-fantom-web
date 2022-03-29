import constants from './constants'

export const reducerName = 'proofsService'

export const initialState = {
  pricingProofs: {},
  constraintsProofs: {},
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
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
