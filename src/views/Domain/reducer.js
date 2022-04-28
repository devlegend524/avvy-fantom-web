import constants from './constants'

export const reducerName = 'myDomainsView'

export const initialState = {
  isLoading: false,
  domain: null,
  auctionPhases: null,
  registrationPremium: null,

  // records
  isSettingRecord: false,
  isLoadingRecords: false,
  records: [],
  avatarRecord: null,
  setRecordComplete: false,
  resolver: null,
  setResolverLoading: false,
  setResolverComplete: false,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading
      }

    case constants.SET_DOMAIN:
      return {
        ...state,
        domain: action.domain
      }

    case constants.SET_AUCTION_PHASES:
      return {
        ...state,
        auctionPhases: action.auctionPhases
      }

    case constants.SET_REGISTRATION_PREMIUM:
      return { 
        ...state,
        registrationPremium: action.premium
      }

    case constants.IS_SETTING_RECORD:
      return {
        ...state,
        isSettingRecord: action.value
      }

    case constants.IS_LOADING_RECORDS:
      return {
        ...state,
        isLoadingRecords: action.value
      }

    case constants.RECORDS_LOADED:
      return {
        ...state,
        records: action.records,
        avatarRecord: action.records.reduce((sum, curr) => {
          if (curr.type === 4) return curr.value
          return sum
        }, null)
      }

    case constants.SET_RECORD_COMPLETE:
      return {
        ...state,
        setRecordComplete: action.value
      }

    case constants.SET_RESOLVER:
      return {
        ...state,
        resolver: action.resolver
      }

    case constants.SET_RESOLVER_LOADING:
      return {
        ...state,
        setResolverLoading: action.loading
      }

    case constants.SET_RESOLVER_COMPLETE:
      return {
        ...state,
        setResolverComplete: action.complete
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
