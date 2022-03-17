import constants from './constants'
import services from 'services'

const actions = {
  addRecord: (name, hash) => {
    return {
      type: constants.ADD_RECORD,
      name,
      hash
    }
  },

  lookup: (hash) => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      try {
        const name = await api.lookupPreimage(hash)
        dispatch(actions.addRecord(name, hash))
      } catch (err) {
      }
    }
  }
}

export default actions
