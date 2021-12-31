import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  isLoading: (state) => root(state).isLoading,
  domain: (state) => root(state).domain,
  auctionPhases: (state) => root(state).auctionPhases,
}

export default selectors
