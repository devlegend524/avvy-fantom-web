import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  domainIds: (state) => root(state).domainIds,
  domainCount: (state) => root(state).domainCount,
  token: (state) => root(state).token,
}

export default selectors
