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
}

export default actions
