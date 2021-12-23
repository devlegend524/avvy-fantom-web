import constants from './constants'

export const reducerName = 'darkmodeService'

export const initialState = {
  isDarkmode: false
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_DARKMODE:
      return {
        ...state,
        isDarkmode: action.value
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
