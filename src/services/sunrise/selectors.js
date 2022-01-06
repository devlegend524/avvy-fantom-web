import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  bids: (state) => root(state).bids,
  names: (state) => Object.keys(selectors.bids(state)),
  nameData: (state) => root(state).nameData,
  bidBundles: (state) => root(state).bidBundles,
  bundles: (state) => root(state).bundles,
  unsubmittedBidNames: (state) => {

    // all names which have bids which are not reflected
    // in bundles
    const bids = selectors.bids(state)
    const bidBundles = selectors.bidBundles(state)
    const bundles = selectors.bundles(state)
    const names = []
    Object.keys(bids).forEach((name) => {
      if (!bidBundles[name]) names.push(name)
      else {
        let bundleId = bidBundles[name]
        let bundle = bundles[bundleId]
        if (!bundle || bundle[name].amount !== bids[name]) {
          names.push(name)
        }
      }
    })
    return names
  },

  revealedBundles: (state) => root(state).revealedBundles,
  revealedBidNames: (state) => {
    const revealedBundles = selectors.revealedBundles(state)
    const bidBundles = selectors.bidBundles(state)
    const names = []
    Object.keys(bidBundles).forEach(domain => {
      if (revealedBundles[bidBundles[domain]]) names.push(domain)
    })
    return names
  },
  constraintsProofs: (state) => root(state).constraintsProofs,
  claimedNames: (state) => root(state).claimedNames,
}

export default selectors
