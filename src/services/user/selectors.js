import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  domains: (state) => root(state).domains,
  domainCount: (state) => root(state).domainCount,
}

export default selectors
