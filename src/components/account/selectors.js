import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  loginError: (state) => root(state).loginError,
  isLoggingIn: (state) => root(state).isLoggingIn,
  resetPasswordResult: (state) => root(state).resetPasswordResult,
  resetPasswordLoading: (state) => root(state).resetPasswordLoading,
  setPasswordResult: (state) => root(state).setPasswordResult,
  setPasswordError: (state) => root(state).setPasswordError,
  setPasswordLoading: (state) => root(state).setPasswordLoading,
  createAccountLoading: (state) => root(state).createAccountLoading,
  createAccountError: (state) => root(state).createAccountError,
  createAccountComplete: (state) => root(state).createAccountComplete,
}

export default selectors
