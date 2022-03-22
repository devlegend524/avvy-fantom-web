import constants from './constants'

export const reducerName = 'myDomainsView'

export const initialState = {
  isLoading: false,
  domain: null,
  auctionPhases: null,

  // records
  isSettingRecord: false,
  isLoadingRecords: false,
  records: [],
  avatarRecord: null,
  setRecordComplete: false,
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
