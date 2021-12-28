import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  progress: (state) => root(state).progress
}

export default selectors
