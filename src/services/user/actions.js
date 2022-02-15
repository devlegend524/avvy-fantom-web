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

  setToken: (token) => {
    return {
      type: constants.SET_TOKEN,
      token,
    }
  },
}

export default actions
