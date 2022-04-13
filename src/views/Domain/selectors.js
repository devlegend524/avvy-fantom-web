import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  isLoading: (state) => root(state).isLoading,
  domain: (state) => root(state).domain,
  auctionPhases: (state) => root(state).auctionPhases,

  isSettingRecord: (state) => root(state).isSettingRecord,
  isLoadingRecords: (state) => root(state).isLoadingRecords,
  records: (state) => root(state).records,
  setRecordComplete: (state) => root(state).setRecordComplete,
  avatarRecord: (state) => root(state).avatarRecord,
  resolver: (state) => root(state).resolver,
  setResolverLoading: (state) => root(state).setResolverLoading,
  setResolverComplete: (state) => root(state).setResolverComplete,
}

export default selectors
