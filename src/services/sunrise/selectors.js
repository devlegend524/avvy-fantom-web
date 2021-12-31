import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  bids: (state) => root(state).bids,
  nameData: (state) => root(state).nameData,
}

export default selectors
