import constants from './constants'

export const reducerName = 'userService'

export const initialState = {
  domains: [],
  domainCount: null,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_DOMAINS:
      return {
        ...state,
        domains: action.domains
      }

    case constants.SET_DOMAIN_COUNT:
      return {
        ...state,
        domainCount: action.domainCount
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
