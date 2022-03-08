import constants from './constants'
import functions from './functions'

const actions = {
  setDarkmode: (value) => {
    functions.setDOMDarkmode(value)
    return {
      type: constants.SET_DARKMODE,
      value,
    }
  },
}

export default actions
