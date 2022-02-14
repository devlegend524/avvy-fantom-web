import constants from './constants'

export const reducerName = 'userService'

export const initialState = {
  domainIds: [],
  domainCount: null,

  hasAccount: null, // whether the user has linked an account on-chain
  accountSignature: null, // the signature from account server for linking on-chain

  token: null,
  verifyWalletLoading: false,
}

export const reducer = (state = initialState, action) => {
  console.log(action)
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

    case constants.SET_HAS_ACCOUNT:
      return {
        ...state,
        hasAccount: action.hasAccount
      }

    case constants.SET_ACCOUNT_SIGNATURE:
      return {
        ...state,
        accountSignature: action.signature
      }

    case constants.SET_TOKEN:
      return {
        ...state,
        token: action.token
      }

    case constants.SET_VERIFY_WALLET_LOADING:
      return {
        ...state,
        verifyWalletLoading: action.loading
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
