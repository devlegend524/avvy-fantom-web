import constants from './constants'

const actions = {
  addRecord: (name, hash) => {
    return {
      type: constants.ADD_RECORD,
      name,
      hash
    }
  },
}

export default actions
