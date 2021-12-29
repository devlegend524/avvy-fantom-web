import constants from './constants'
import services from 'services'

const actions = {
  setLoading: (isLoading) => {
    return {
      type: constants.SET_LOADING,
      isLoading,
    }
  },

  setDomain: (domain) => {
    return {
      type: constants.SET_DOMAIN,
      domain
    }
  },

  loadDomain: (_domain) => {
    return async (dispatch, getState) => {
      dispatch(actions.setLoading(true))
      const api = services.provider.buildAPI()
      const domain = await api.loadDomain(_domain)
      dispatch(services.namehash.actions.addRecord(_domain, domain.hash))
      dispatch(actions.setDomain(domain))
      dispatch(actions.setLoading(false))
    }
  },
}

export default actions
