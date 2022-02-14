import constants from './constants'
import services from 'services'

const actions = {
  setDomainIds: (domainIds) => {
    return {
      type: constants.SET_DOMAIN_IDS,
      domainIds
    }
  },

  setDomainCount: (domainCount) => {
    return {
      type: constants.SET_DOMAIN_COUNT,
      domainCount
    }
  },

  loadDomains: () => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      dispatch(actions.setDomainCount(null))
      const domainIds = await api.getDomainIDsByOwner(api.account)
      dispatch(actions.setDomainIds(domainIds))
      dispatch(actions.setDomainCount(domainIds.length))
    }
  },

  setHasAccount: (hasAccount) => {
    return {
      type: constants.SET_HAS_ACCOUNT,
      hasAccount
    }
  },

  setAccountSignature: (signature) => {
    return {
      type: constants.SET_ACCOUNT_SIGNATURE,
      signature
    }
  },

  checkHasAccount: () => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const hasAccount = await api.checkHasAccount()
      dispatch(actions.setHasAccount(hasAccount))
    }
  },

  setToken: (token) => {
    return {
      type: constants.SET_TOKEN,
      token,
    }
  },

  setVerifyWalletLoading: (loading) => {
    return {
      type: constants.SET_VERIFY_WALLET_LOADING,
      loading
    }
  },

  verifyWallet: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setVerifyWalletLoading(true))
      const api = services.provider.buildAPI()
      try {
        const token = services.user.selectors.token(getState())
        const challenge = await services.account.getVerifyChallenge(token)
        const signature = await services.provider.signMessage(challenge)
        await services.account.submitVerifySignature(api.account, signature)
      } catch (err) {
      }
      dispatch(actions.setVerifyWalletLoading(false))
    }
  },

  resetVerifyWallet: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setVerifyWalletLoading(false))
    }
  },
}

export default actions
