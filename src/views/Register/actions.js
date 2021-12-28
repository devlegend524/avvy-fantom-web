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

  setProgress: (progress) => {
    return {
      type: constants.SET_PROGRESS,
      progress
    }
  },

  generateProofs: (names) => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      for (let i = 0; i < names.length; i += 1) {
        let name = names[i]
        dispatch(actions.setProgress({
          message: `Generating pricing proof for ${name}`,
          percent: parseInt((i / names.length) * 100)
        }))
        let res = await api.generateDomainPriceProof(name)
        dispatch(actions.setPricingProof(name, res.calldata))
      }
      dispatch(actions.setProgress({
        message: 'Done',
        percent: 100,
      }))
    }
  }
}

export default actions
