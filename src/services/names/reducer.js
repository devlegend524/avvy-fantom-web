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

    case constants.BULK_ADD_RECORDS:
      console.log(action)
      return {
        ...state,
        reverseLookups: {
          ...state.reverseLookups,
          ...action.names.reduce((obj, name, index) => {
            const hash = action.hashes[index]
            obj[hash] = name
            return obj
          }, {})
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
