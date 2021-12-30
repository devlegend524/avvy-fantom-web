import constants from './constants'

export const reducerName = 'nameService'

export const initialState = {
  reverseLookups: {}, // these lookups use the hash as a key and resolve to the name.
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ADD_RECORD:
      return {
        ...state,
        reverseLookups: {
          ...state.reverseLookups,
          [action.hash]: action.name
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
