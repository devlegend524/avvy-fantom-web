import constants from './constants'

export const reducerName = 'userService'

export const initialState = {
  domainIds: [],
  domainCount: null,

  token: null,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_DOMAIN_IDS:
      return {
        ...state,
        domainIds: action.domainIds
      }

    case constants.SET_DOMAIN_COUNT:
      return {
        ...state,
        domainCount: action.domainCount
      }

    case constants.SET_TOKEN:
      return {
        ...state,
        token: action.token
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
