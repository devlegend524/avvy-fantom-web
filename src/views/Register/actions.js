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

  generateProofs: (names) => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      let j = 0;
      const numSteps = names.length * 2
      for (let i = 0; i < names.length; i += 1) {
        let name = names[i]
        dispatch(actions.setProgress({
          message: `Generating pricing proof for ${name}`,
          percent: parseInt((j / numSteps) * 100)
        }))
        let pricingRes = await api.generateDomainPriceProof(name)
        dispatch(actions.setPricingProof(name, pricingRes.calldata))
        j += 1
        dispatch(actions.setProgress({
          message: `Generating constraints proof for ${name}`,
          percent: parseInt((j / numSteps) * 100),
        }))
        let constraintsRes = await api.generateConstraintsProof(name)
        dispatch(actions.setConstraintsProof(name, constraintsRes.calldata))
        j += 1
        dispatch(actions.setProgress({
          message: `Getting quote for ${name}`,
          percent: parseInt((j / numSteps) * 100),
        }))
      }
      dispatch(actions.setProgress({
        message: 'Done',
        percent: 100,
      }))
    }
  },

  commit: (names, quantities) => {
    return async (dispatch, getState) => {
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
      let salt = 'test'
      dispatch(actions.setSalt(salt))
      await api.commit(
        names,
        quantities,
        constraintsProofs,
        pricingProofs,
        salt,
      )
    }
  },

  finalize: () => {
    return async (dispatch, getState) => {
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
    }
  },
}

export default actions
