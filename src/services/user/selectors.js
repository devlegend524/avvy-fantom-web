import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  domainIds: (state) => root(state).domainIds,
  domainCount: (state) => root(state).domainCount,
  hasAccount: (state) => root(state).hasAccount,
  accountSignature: (state) => root(state).accountSignature,
  token: (state) => root(state).token,
  loginError: (state) => root(state).loginError,
  resetPasswordResult: (state) => root(state).resetPasswordResult,
  resetPasswordLoading: (state) => root(state).resetPasswordLoading,
  setPasswordResult: (state) => root(state).setPasswordResult,
  setPasswordError: (state) => root(state).setPasswordError,
  setPasswordLoading: (state) => root(state).setPasswordLoading,
  verifyWalletLoading: (state) => root(state).verifyWalletLoading,
}

export default selectors
