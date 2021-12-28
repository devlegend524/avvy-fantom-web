import constants from './constants'
import selectors from './selectors'
import services from 'services'

const actions = {
  _addToCart: (name) => {
    return {
      type: constants.ADD_TO_CART,
      name
    }
  },

  addToCart: (name) => {
    return (dispatch, getState) => {
      dispatch(actions._addToCart(name))
      dispatch(actions.refreshNameData(name))
    }
  },

  removeFromCart: (name) => {
    return {
      type: constants.REMOVE_FROM_CART,
      name
    }
  },

  _setQuantity: (name, quantity) => {
    return {
      type: constants.SET_QUANTITY,
      name,
      quantity
    }
  },

  incrementQuantity: (name) => {
    return (dispatch, getState) => {
      const quantities = selectors.quantities(getState())
      if (quantities[name] + 1> services.environment.MAX_REGISTRATION_QUANTITY) return
      dispatch(actions._setQuantity(name, quantities[name] + 1))
    }
  },

  decrementQuantity: (name) => {
    return (dispatch, getState) => {
      const quantities = selectors.quantities(getState())
      if (quantities[name] - 1 < 1) return
      dispatch(actions._setQuantity(name, quantities[name] - 1))
    }
  },

  setNameData: (name, data) => {
    return {
      type: constants.SET_NAME_DATA,
      name,
      data
    }
  },

  refreshNameData: (name) => {
    return async (dispatch, getState) => {
      console.log(`refreshing ${name}`)
      const api = services.provider.buildAPI()
      const data = await api.loadDomain(name)
      dispatch(actions.setNameData(name, data))
    }
  },

  refreshAllNameData: () => {
    return async (dispatch, getState) => {
      console.log('here..')
      const names = selectors.names(getState())
      console.log(names)
      names.forEach((name) => {
        dispatch(actions.refreshNameData(name))
      })
    }
  },
}

export default actions
