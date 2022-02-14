import services from 'services'

import constants from './constants'

const actions = {
  login: (username, password) => {
    return async (dispatch, getState) => {
      dispatch(actions.setIsLoggingIn(true))
      const token = await services.account.login(username, password)
      if (token) {
        dispatch(services.user.actions.setToken(token))
      } else {
        dispatch(actions.setLoginError('Invalid email / password'))
      }
      dispatch(actions.setIsLoggingIn(false))
    }
  },
  
  setLoginError: (error) => {
    return {
      type: constants.SET_LOGIN_ERROR,
      error
    }
  },

  setIsLoggingIn: (loggingIn) => {
    return {
      type: constants.SET_IS_LOGGING_IN,
      loggingIn,
    }
  },

  resetLogin: () => {
    return (dispatch, getState) => {
      dispatch(actions.setLoginError(null))
      dispatch(actions.setIsLoggingIn(false))
    }
  },

  setResetPasswordLoading: (loading) => {
    return {
      type: constants.SET_RESET_PASSWORD_LOADING,
      loading
    }
  },

  setResetPasswordResult: (result) => {
    return {
      type: constants.SET_RESET_PASSWORD_RESULT,
      result
    }
  },

  resetPassword: (email) => {
    return async (dispatch, getState) => {
      dispatch(actions.setResetPasswordLoading(true))
      const result = await services.account.resetPassword(email)
      dispatch(actions.setResetPasswordResult(result))
      dispatch(actions.setResetPasswordLoading(false))
    }
  },

  resetResetPassword: () => {
    return (dispatch, getState) => {
      dispatch(actions.setResetPasswordLoading(false))
      dispatch(actions.setResetPasswordResult(null))
    }
  },

  setSetPasswordResult: (result) => {
    return {
      type: constants.SET_SET_PASSWORD_RESULT,
      result,
    }
  },

  setSetPasswordError: (error) => {
    return {
      type: constants.SET_SET_PASSWORD_ERROR,
      error
    }
  },

  setSetPasswordLoading: (loading) => {
    return {
      type: constants.SET_SET_PASSWORD_LOADING,
      loading,
    }
  },

  setPassword: (token, password, passwordConfirm) => {
    return async (dispatch, getState) => {
      dispatch(actions.setSetPasswordLoading(true))
      dispatch(actions.setSetPasswordError(false))
      const res = await services.account.setPassword(token, password, passwordConfirm)
      if (res.token) {
        dispatch(services.user.actions.setToken(res.token))
        dispatch(actions.setSetPasswordResult(true))
      } else {
        dispatch(actions.setSetPasswordError(res.error))
        dispatch(actions.setSetPasswordResult(false))
      }
      dispatch(actions.setSetPasswordLoading(false))
    }
  },

  resetSetPassword: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setSetPasswordResult(false))
      dispatch(actions.setSetPasswordError(null))
      dispatch(actions.setSetPasswordLoading(false))
    }
  },

}

export default actions
