import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  //auctionPhases: (state) => root(state).auctionPhases,
}

export default selectors
