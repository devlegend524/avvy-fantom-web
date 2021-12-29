import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  progress: (state) => root(state).progress,
  constraintsProofs: (state) => root(state).constraintsProofs,
  pricingProofs: (state) => root(state).pricingProofs,
  commitHash: (state) => root(state).commitHash,
  commitSalt: (state) => root(state).commitSalt,
}

export default selectors
