import constants from './constants'
import services from 'services'

const actions = {
  setDomains: (domains) => {
    return {
      type: constants.SET_DOMAINS,
      domains
    }
  },

  setDomainCount: (domainCount) => {
    console.log('setting domain count', domainCount)
    return {
      type: constants.SET_DOMAIN_COUNT,
      domainCount
    }
  },

  loadDomains: () => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      dispatch(actions.setDomains(null))
      const balanceOf = await api.contracts.Domain.balanceOf(api.account)
      dispatch(actions.setDomainCount(parseInt(balanceOf.toString())))
      const domains = []
      dispatch(actions.setDomains(domains))
    }
  },
}

export default actions
