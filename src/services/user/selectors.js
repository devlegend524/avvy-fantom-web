import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  domainIds: (state) => root(state).domainIds,
  domainCount: (state) => root(state).domainCount,
  hasAccount: (state) => root(state).hasAccount,
  accountSignature: (state) => root(state).accountSignature,
  token: (state) => root(state).token,
  verifyWalletLoading: (state) => root(state).verifyWalletLoading,
}

export default selectors
