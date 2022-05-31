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
        dispatch(services.names.actions.checkIsRevealed(domain.hash))
        if (domain.status === domain.constants.DOMAIN_STATUSES.REGISTERED_SELF || domain.status === domain.constants.DOMAIN_STATUSES.REGISTERED_OTHER) dispatch(actions.loadRecords(_domain))
        if (domain.status === domain.constants.DOMAIN_STATUSES.REGISTERED_SELF) {
          const currExpiry = domain.expiresAt
          const now = parseInt(Date.now() / 1000)
          const oneYear = 365 * 24 * 60 * 60 // this value is directly from the LeasingAgent
          const registeredExpiry = currExpiry + 2 * oneYear
          domain.canRenew = !(registeredExpiry >= now + oneYear * services.environment.MAX_REGISTRATION_QUANTITY)
        }
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

  setRevealingDomain: (isRevealing) => {
    return {
      type: constants.IS_REVEALING_DOMAIN,
      isRevealing
    }
  },

  setRevealComplete: (isRevealed) => {
    return {
      type: constants.SET_REVEAL_COMPLETE,
      isRevealed
    }
  },

  revealDomain: (domain) => {
    return async (dispatch, getState) => {
      dispatch(actions.setRevealingDomain(true))
      const api = services.provider.buildAPI()
      const hash = await api.client.utils.nameHash(domain)
      let failed = false
      try {
        await api.revealDomain(domain)
      } catch (err) {
        failed = true
      }
      dispatch(actions.setRevealingDomain(false))
      if (!failed) {
        dispatch(actions.setRevealComplete(true))
        dispatch(services.names.actions.isRevealed(hash, true))
      }
    }
  },

  resetRevealDomain: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setRevealingDomain(false))
      dispatch(actions.setRevealComplete(false))
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
  },

  setRegistrationPremium: (premium) => {
    return {
      type: constants.SET_REGISTRATION_PREMIUM,
      premium
    }
  },

  loadRegistrationPremium: () => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const premium = await api.getRegistrationPremium()
      dispatch(actions.setRegistrationPremium(premium))
    }
  },

  // records

  isSettingRecord: (value) => {
    return {
      type: constants.IS_SETTING_RECORD,
      value 
    }
  },
  
  setRecordComplete: (value) => {
    return {
      type: constants.SET_RECORD_COMPLETE,
      value
    }
  },

  setStandardRecord: (domain, type, value) => {
    return async (dispatch, getState) => {
      dispatch(actions.isSettingRecord(true))
      const api = services.provider.buildAPI()
      try {
        await api.setStandardRecord(domain, type, value)
        dispatch(actions.loadRecords(domain))
        dispatch(actions.setRecordComplete(true))
      } catch (err) {
        services.logger.error(err)
        alert('Failed to set record')
      }
      dispatch(actions.isSettingRecord(false))
    }
  },

  isLoadingRecords: (value) => {
    return {
      type: constants.IS_LOADING_RECORDS,
      value
    }
  },
  
  recordsLoaded: (records) => {
    return {
      type: constants.RECORDS_LOADED,
      records
    }
  },

  _setResolver: (resolver) => {
    return {
      type: constants.SET_RESOLVER,
      resolver
    }
  },

  setResolverLoading: (loading) => {
    return {
      type: constants.SET_RESOLVER_LOADING,
      loading
    }
  },

  setResolverComplete: (complete) => {
    return {
      type: constants.SET_RESOLVER_COMPLETE,
      complete
    }
  },

  setResolver: (domain, resolverAddress) => {
    return async (dispatch, getState) => {
      dispatch(actions.setResolverLoading(true))
      const api = await services.provider.buildAPI()
      try {
        await api.setResolver(domain, resolverAddress)
        dispatch(actions.loadRecords(domain))
        dispatch(actions.setResolverComplete(true))
      } catch (err) {
        alert('Failed to set resolver')
      }
      dispatch(actions.setResolverLoading(false))
    }
  },

  loadRecords: (domain) => {
    return async (dispatch, getState) => {
      dispatch(actions.isLoadingRecords(true))
      const api = services.provider.buildAPI()
      let resolver = null
      try {
        resolver = await api.getResolver(domain)
      } catch (err) {
        resolver = null
      }
      dispatch(actions._setResolver(resolver))
      if (resolver) {
        const records = await api.getStandardRecords(domain)
        dispatch(actions.recordsLoaded(records.map(record => Object.assign(record, {
          typeName: services.records.getStandard(record.type).name
        }))))
      }
      dispatch(actions.isLoadingRecords(false))
    }
  }

}

export default actions
