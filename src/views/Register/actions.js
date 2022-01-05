import services from 'services'

import constants from './constants'
import selectors from './selectors'

const actions = {
  setSalt: (salt) => {
    return {
      type: constants.SET_SALT,
      salt
    }
  },

  setHash: (hash) => {
    return {
      type: constants.SET_HASH,
      hash
    }
  },

  setPricingProof: (domain, proof) => {
    return {
      type: constants.SET_PRICING_PROOF,
      domain,
      proof
    }
  },

  setConstraintsProof: (domain, proof) => {
    return {
      type: constants.SET_CONSTRAINTS_PROOF,
      domain,
      proof
    }
  },

  setProgress: (progress) => {
    return {
      type: constants.SET_PROGRESS,
      progress
    }
  },

  setIsCommitting:(value) => {
    return {
      type: constants.SET_IS_COMMITTING,
      value
    }
  },

  setIsFinalizing:(value) => {
    return {
      type: constants.SET_IS_FINALIZING,
      value
    }
  },

  setHasCommit: (value) => {
    return {
      type: constants.SET_HAS_COMMIT,
      value
    }
  },

  setHasError: (value) => {
    return {
      type: constants.SET_HAS_ERROR,
      value
    }
  },

  setIsComplete: (value) => {
    return {
      type: constants.SET_IS_COMPLETE,
      value
    }
  },

  reset: () => {
    return (dispatch, getState) => {
      dispatch(actions.setIsComplete(false))
      dispatch(actions.setHasCommit(false))
      dispatch(actions.setIsFinalizing(false))
      dispatch(actions.setIsCommitting(false))
      dispatch(actions.setProgress(0))
    }
  },

  generateProofs: (names) => {
    return async (dispatch, getState) => {
      try {
        const api = services.provider.buildAPI()
        let j = 0;
        const numSteps = names.length * 2
        for (let i = 0; i < names.length; i += 1) {
          let name = names[i]
          dispatch(actions.setProgress({
            message: `Generating pricing proof for ${name} (${j+1}/${numSteps})`,
            percent: parseInt((j / numSteps) * 100)
          }))
          let pricingRes = await api.generateDomainPriceProof(name)
          dispatch(actions.setPricingProof(name, pricingRes.calldata))
          j += 1
          dispatch(actions.setProgress({
            message: `Generating constraints proof for ${name} (${j+1}/${numSteps})`,
            percent: parseInt((j / numSteps) * 100),
          }))
          let constraintsRes = await api.generateConstraintsProof(name)
          dispatch(actions.setConstraintsProof(name, constraintsRes.calldata))
          j += 1
        }
        dispatch(actions.setProgress({
          message: `Done`,
          percent: 100,
        }))
      } catch (err) {
        console.log(err)
        dispatch(actions.setHasError(true))
      }
    }
  },

  commit: (names, quantities) => {
    return async (dispatch, getState) => {
      try {
        dispatch(actions.setIsCommitting(true))
        const state = getState()
        const api = services.provider.buildAPI()
        const names = services.cart.selectors.names(state)
        const _quantities = services.cart.selectors.quantities(state)
        const _constraintsProofs = selectors.constraintsProofs(state)
        const _pricingProofs = selectors.pricingProofs(state)
        let quantities = []
        let pricingProofs = []
        let constraintsProofs = []
        names.forEach(name => {
          quantities.push(_quantities[name])
          pricingProofs.push(_pricingProofs[name])
          constraintsProofs.push(_constraintsProofs[name])
        })
        let salt = services.random.salt()
        dispatch(actions.setSalt(salt))
        await api.commit(
          names,
          quantities,
          constraintsProofs,
          pricingProofs,
          salt,
        )
        dispatch(actions.setHasCommit(true))
      } catch (err) {
        if (err.code === 4001) {
          dispatch(actions.setIsCommitting(false))
          return // user rejected transaction, give them another chance
        }
        dispatch(actions.setHasError(true))
      }
    }
  },

  finalize: () => {
    return async (dispatch, getState) => {
      try {
        dispatch(actions.setIsFinalizing(true))
        const state = getState()
        const api = services.provider.buildAPI()
        const names = services.cart.selectors.names(state)
        const salt = selectors.commitSalt(state)
        const _quantities = services.cart.selectors.quantities(state)
        const _constraintsProofs = selectors.constraintsProofs(state)
        const _pricingProofs = selectors.pricingProofs(state)
        let quantities = []
        let pricingProofs = []
        let constraintsProofs = []
        names.forEach(name => {
          quantities.push(_quantities[name])
          pricingProofs.push(_pricingProofs[name])
          constraintsProofs.push(_constraintsProofs[name])
        })
        await api.register(
          names,
          quantities,
          constraintsProofs,
          pricingProofs,
          salt,
        )
        dispatch(actions.setIsComplete(true))
        dispatch(services.cart.actions.clear())
      } catch (err) {
        if (err.code === 4001) {
          dispatch(actions.setIsFinalizing(false))
          return // user rejected transaction, give them another chance
        }
        dispatch(actions.setHasError(true))
      }
    }
  },
}

export default actions
