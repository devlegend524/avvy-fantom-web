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
  
  setLoginError: (error) => {
    return {
      type: constants.SET_LOGIN_ERROR,
      error
    }
  },

  login: (username, password) => {
    return async (dispatch, getState) => {
      const token = await services.account.login(username, password)
      if (token) {
        dispatch(actions.setToken(token))
      } else {
        dispatch(actions.setLoginError('Invalid email / password'))
      }
    }
  },

  resetConnectAccount: () => {
    return (dispatch, getState) => {
      dispatch(actions.setLoginError(null))
      dispatch(actions.setResetPasswordLoading(false))
      dispatch(actions.setResetPasswordResult(null))
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
        dispatch(actions.setToken(res.token))
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
