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
      let domain
      let isSupported = await api.isSupported(_domain)
      if (isSupported) {
        domain = await api.loadDomain(_domain)
        dispatch(services.names.actions.addRecord(_domain, domain.hash))
      } else {
        domain = {
          supported: false,
          domain: _domain
        }
      }
      dispatch(actions.setDomain(domain))
      dispatch(actions.setLoading(false))
    }
  },

  setAuctionPhases: (auctionPhases) => {
    return {
      type: constants.SET_AUCTION_PHASES,
      auctionPhases
    }
  },

  loadAuctionPhases: () => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const auctionPhases = await api.getAuctionPhases()
      dispatch(actions.setAuctionPhases(auctionPhases))
    }
  }
}

export default actions
