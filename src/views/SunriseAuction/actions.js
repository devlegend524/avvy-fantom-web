import constants from './constants'
import selectors from './selectors'
import services from 'services'

import client from '@avvy/client'
import { ethers } from 'ethers'

const actions = {
  setAuctionPhases: (auctionPhases) => {
    return {
      type: constants.SET_AUCTION_PHASES,
      auctionPhases
    }
  },

  loadAuctionPhases: () => { return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const auctionPhases = await api.getAuctionPhases()
      dispatch(actions.setAuctionPhases(auctionPhases))
    }
  },

  setProofProgress: (proofProgress) => {
    return {
      type: constants.SET_PROOF_PROGRESS,
      proofProgress
    }
  },

  setHasBidError: (hasError) => {
    return {
      type: constants.SET_HAS_BID_ERROR,
      hasError
    }
  },

  setBiddingIsComplete: (isComplete) => {
    return {
      type: constants.SET_BIDDING_IS_COMPLETE,
      isComplete
    }
  },

  setBiddingInProgress: (value) => {
    return {
      type: constants.SET_BIDDING_IN_PROGRESS,
      value
    }
  },

  generateProofs: (names) => {
    return async (dispatch, getState) => {
      try {
        const state = getState()
        const names = services.sunrise.selectors.unsubmittedBidNames(state)
        const api = services.provider.buildAPI()
        let j = 0;
        const numSteps = names.length
        for (let i = 0; i < names.length; i += 1) {
          let name = names[i]
          dispatch(actions.setProofProgress({
            message: `Generating constraints proof for ${name} (${j}/${numSteps})`,
            percent: parseInt((j / numSteps) * 100),
          }))
          let constraintsRes = await api.generateConstraintsProof(name)
          dispatch(services.sunrise.actions.setConstraintsProof(name, constraintsRes.calldata))
          j += 1
        }
        dispatch(actions.setProofProgress({
          message: `Done`,
          percent: 100,
        }))
      } catch (err) {
        console.log(err)
        return dispatch(actions.setHasBidError(true))
      }
    }
  },

  submitBid: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setBiddingInProgress(true))
      const api = services.provider.buildAPI()
      const state = getState()

      // this maps bids to "bundles" which get submitted to the chain
      const bids = services.sunrise.selectors.bids(state)
      const names = services.sunrise.selectors.unsubmittedBidNames(state)
      
      const bundle = {}
      for (let i = 0; i < names.length; i += 1) {
        let name = names[i]
        if (i === 0) {
          bundle.payload = {
            names: [],
            amounts: [],
            salt: services.random.salt()
          }
        }
        let hash = await client.nameHash(name)
        bundle.payload.names[i] = hash.toString()
        bundle.payload.amounts[i] = bids[name]
        bundle[name] = {
          amount: bids[name],
          hash: hash.toString()
        }
      }

      bundle.payload.hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['int[]', 'int[]', 'string'],
          [bundle.payload.names, bundle.payload.amounts, bundle.payload.salt]
        )
      )
      
      try {
        await api.bid(bundle.payload.hash)
      } catch (err) {
        console.log(err)
        return dispatch(actions.setHasBidError(true))
      }
      
      names.forEach((name) => {
        dispatch(services.sunrise.actions.setBidBundle(name, bundle.payload.hash))
      })

      dispatch(services.sunrise.actions.addBundle(bundle.payload.hash, bundle))
      dispatch(actions.setBiddingInProgress(false))
      dispatch(actions.setBiddingIsComplete(true))
    }
  },

  setRevealingBundle: (bundleKey, value) => {
    return {
      type: constants.SET_REVEALING_BUNDLE,
      bundleKey,
      value
    }
  },

  setHasRevealError: (value) => {
    return {
      type: constants.SET_HAS_REVEAL_ERROR,
      value
    }
  },

  revealBundle: (bundleKey) => {
    return async (dispatch, getState) => {
      dispatch(actions.setRevealingBundle(bundleKey, true))
      const api = services.provider.buildAPI()
      const state = getState()
      const bundles = services.sunrise.selectors.bundles(state)
      const bundle = bundles[bundleKey]
      try { 
        await api.reveal(bundle.payload.names, bundle.payload.amounts, bundle.payload.salt)
      } catch (err) {
        console.log(err)
        dispatch(actions.setRevealingBundle(bundleKey, false))
        return dispatch(actions.setHasRevealError(true))
      }
      dispatch(actions.setRevealingBundle(bundleKey, false))
      dispatch(services.sunrise.actions.revealBundle(bundleKey))
    }
  },

  setAuctionResult: (domain, result) => {
    return {
      type: constants.SET_AUCTION_RESULT,
      domain,
      result
    }
  },

  setLoadingWinningBids: (isLoading) => {
    return {
      type: constants.SET_LOADING_WINNING_BIDS,
      isLoading
    }
  },

  winningBidsLoaded: (loaded) => {
    return {
      type: constants.WINNING_BIDS_LOADED,
      loaded
    }
  },

  loadWinningBids: (force) => {
    return async (dispatch, getState) => {
      const state = getState()
      const isLoading = selectors.isLoadingWinningBids(state)
      if (isLoading && !force) return
      dispatch(actions.setLoadingWinningBids(true))
      const api = services.provider.buildAPI()
      const bids = services.sunrise.selectors.bids(state)
      const bidBundles = services.sunrise.selectors.bidBundles(state)
      const revealedBundles = services.sunrise.selectors.revealedBundles(state)
      for (let domain in bidBundles) {
        if (revealedBundles[bidBundles[domain]]) {
          let result = await api.getWinningBid(domain)
          dispatch(actions.setAuctionResult(domain, result))
        }
      }
      dispatch(actions.winningBidsLoaded(true))
      setTimeout(() => {
        dispatch(actions.setLoadingWinningBids(false))
      }, 60000)
    }
  },

  setAvailableWavax: (amount) => {
    return {
      type: constants.SET_AVAILABLE_WAVAX,
      amount
    }
  },

  setApprovedWavax: (amount) => {
    return {
      type: constants.SET_APPROVED_WAVAX,
      amount
    }
  },

  checkAvailableWAVAX: () => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const wavax = await api.getAuctionWavax()
      const balance = await api.getWavaxBalance()
      dispatch(actions.setAvailableWavax(balance))
      dispatch(actions.setApprovedWavax(wavax))
    }
  },

  isApprovingWavax: (value) => {
    return {
      type: constants.SET_IS_APPROVING_WAVAX,
      value
    }
  },

  approveWavax: (total) => {
    return async (dispatch, getState) => {
      dispatch(actions.isApprovingWavax(true))
      const api = services.provider.buildAPI()
      try {
        await api.approveWavaxForAuction(total)
      } catch (err) {
      }
      dispatch(actions.checkAvailableWAVAX())
      dispatch(actions.isApprovingWavax(false))
    }
  },

  isClaimingDomains: (value) => {
    return {
      type: constants.SET_IS_CLAIMING_DOMAINS,
      value
    }
  },

  claimAll: () => {
    return async (dispatch, getState) => {
      dispatch(actions.isClaimingDomains(true))
      const api = services.provider.buildAPI()
      const state = getState()
      const auctionResults = selectors.auctionResults(state)
      const constraintsProofs = services.sunrise.selectors.constraintsProofs(state)
      const names = []
      const constraintsData = []
      Object.keys(auctionResults).forEach((name) => {
        if (auctionResults[name].isWinner && auctionResults[name].type !== 'IS_CLAIMED') {
          names.push(name)
          constraintsData.push(constraintsProofs[name])
        }
      })
      if (names.length === 0) return
      try {
        await api.sunriseClaim(names, constraintsData)
        names.forEach(name => {
          dispatch(services.sunrise.actions.setClaimed(name))
        })
      } catch (err) {
        console.log(err)
      }
      dispatch(actions.isClaimingDomains(false))
    }
  },

  addBulkBids: (bids) => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      for (let _domain in bids) {
        let domain = _domain.toLowerCase()
        if (api.isSupported(domain)) {
          try {
            ethers.BigNumber.from(bids[domain])
            const hash = await client.nameHash(domain)
            dispatch(services.names.actions.addRecord(domain, hash.toString()))
            dispatch(services.sunrise.actions.addBid(domain, bids[domain]))
          } catch (err) {
          }
        } else {
        }
      }
    }
  },
}

export default actions
