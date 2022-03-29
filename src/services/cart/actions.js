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

  _addBulkRegistrations: (names, quantities, nameData) => {
    return {
      type: constants.ADD_BULK_REGISTRATIONS,
      names,
      quantities,
      nameData,
    }
  },

  addBulkRegistrations: (registrations) => {
    return async (dispatch, getState) => {
      let nameData = {}
      const api = services.provider.buildAPI()
      const names = []
      const quantities = {}
      for (let name in registrations) {
        let isSupported = await api.isSupported(name)
        let quantity = parseInt(registrations[name])
        if (isSupported && quantity > 0) {
          names.push(name)
          quantities[name] = quantity > services.environment.MAX_REGISTRATION_QUANTITY ? services.environment.MAX_REGISTRATION_QUANTITY : quantity 
          let data = await api.loadDomain(name)
          nameData[name] = data
        }
      }
      dispatch(actions._addBulkRegistrations(names, quantities, nameData))
    }
  },

  removeFromCart: (name) => {
    return {
      type: constants.REMOVE_FROM_CART,
      name
    }
  },

  clear: () => {
    return (dispatch, getState) => {
      const names = selectors.names(getState())
      names.forEach(name => dispatch(actions.removeFromCart(name)))
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
      const state = getState()
      const quantities = selectors.quantities(state)
      const nameData = selectors.nameData(state)[name]

      const quantity = quantities[name]

      // prevent renewal quantity from exceeding max registration length
      if (nameData.status === nameData.constants.DOMAIN_STATUSES.REGISTERED_SELF) {
        const currExpiry = nameData.expiresAt
        const now = parseInt(Date.now() / 1000)
        const oneYear = 365 * 24 * 60 * 60 // this value is directly from the LeasingAgent
        const registeredExpiry = currExpiry + (quantity + 1) * oneYear
        if (registeredExpiry >= now + oneYear * services.environment.MAX_REGISTRATION_QUANTITY) return
      }
      
      // prevent registration quantity from exceeding max registration length
      if (quantity + 1 > services.environment.MAX_REGISTRATION_QUANTITY) return

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
      const api = services.provider.buildAPI()
      const data = await api.loadDomain(name)
      dispatch(actions.setNameData(name, data))
    }
  },

  isRefreshingNameData: (value) => {
    return {
      type: constants.IS_REFRESHING_NAME_DATA,
      value
    }
  },

  refreshAllNameData: () => {
    return async (dispatch, getState) => {
      dispatch(actions.isRefreshingNameData(true))
      const names = selectors.names(getState())
      names.forEach((name) => {
        dispatch(actions.refreshNameData(name))
      })
      dispatch(actions.isRefreshingNameData(false))
    }
  },
}

export default actions
