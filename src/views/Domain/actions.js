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
        if (domain.status === domain.constants.DOMAIN_STATUSES.REGISTERED_SELF || domain.status === domain.constants.DOMAIN_STATUSES.REGISTERED_OTHER) dispatch(actions.loadRecords(_domain))
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

  loadRecords: (domain) => {
    return async (dispatch, getState) => {
      dispatch(actions.isLoadingRecords(true))
      const api = services.provider.buildAPI()
      const records = await api.getStandardRecords(domain)
      dispatch(actions.recordsLoaded(records.map(record => Object.assign(record, {
        typeName: services.records.getStandard(record.type).name
      }))))
      dispatch(actions.isLoadingRecords(false))
    }
  }

}

export default actions
