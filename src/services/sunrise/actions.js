import constants from './constants'
import selectors from './selectors'
import services from 'services'

const actions = {
  _addBid: (domain, amount) => {
    return {
      type: constants.ADD_BID,
      domain,
      amount
    }
  },

  addBid: (domain, amount) => {
    return (dispatch, getState) => {
      dispatch(actions._addBid(domain, amount))
      dispatch(actions.refreshNameData(domain))
    }
  },

  deleteBid: (domain) => {
    return {
      type: constants.DELETE_BID,
      domain,
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

  refreshAllNameData: () => {
    return async (dispatch, getState) => {
      const names = selectors.names(getState())
      names.forEach((name) => {
        dispatch(actions.refreshNameData(name))
      })
    }
  },
}

export default actions
