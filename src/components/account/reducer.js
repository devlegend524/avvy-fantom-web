import constants from './constants'

export const reducerName = 'accountComponent'

export const initialState = {
  loginError: null,
  isLoggingIn: false,
  resetPasswordResult: null,
  resetPasswordLoading: false,
  setPasswordLoading: false,
  setPasswordError: null,
  setPasswordResult: null,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.error
      }

    case constants.SET_IS_LOGGING_IN:
      return {
        ...state,
        isLoggingIn: action.loggingIn,
      }

    case constants.SET_RESET_PASSWORD_RESULT:
      return {
        ...state,
        resetPasswordResult: action.result,
      }

    case constants.SET_RESET_PASSWORD_LOADING:
      return {
        ...state,
        resetPasswordLoading: action.loading
      }

    case constants.SET_SET_PASSWORD_LOADING:  
      return {
        ...state,
        setPasswordLoading: action.loading
      }

    case constants.SET_SET_PASSWORD_ERROR:  
      return {
        ...state,
        setPasswordError: action.error
      }

    case constants.SET_SET_PASSWORD_RESULT:  
      return {
        ...state,
        setPasswordResult: action.result
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
