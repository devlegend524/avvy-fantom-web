import services from 'services'

import constants from './constants'

const actions = {
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
      for (let i = 0; i < names.length; i += 1) {
        let name = names[i]
        dispatch(actions.setProgress({
          message: `Generating pricing proof for ${name}`,
          percent: parseInt((j / names.length / 2) * 100)
        }))
        let res = await api.generateDomainPriceProof(name)
        dispatch(actions.setPricingProof(name, res.calldata))
        j += 1
        dispatch(actions.setProgress({
          message: `Generating constraints proof for ${name}`,
          percent: parseInt((j / names.length / 2) * 100),
        }))
        res = await api.generateConstraintsProof(name)
        dispatch(actions.setConstraintsProof(name, res.calldata))
        j += 1
      }
      dispatch(actions.setProgress({
        message: 'Done',
        percent: 100,
      }))
    }
  }
}

export default actions
