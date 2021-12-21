import constants from './constants'

const actions = {
  setDarkmode: (value) => {
    const rootElem = document.documentElement
    if (value) {
      rootElem.classList.add('dark')
    } else {
      rootElem.classList.remove('dark')
    }
    return {
      type: constants.SET_DARKMODE,
      value,
    }
  },
}

export default actions
