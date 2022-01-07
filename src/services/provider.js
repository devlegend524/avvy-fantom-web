//
// This service handles the connection
// with the web3 provider
//

import API from 'services/api'
import { ethers } from 'ethers'

import services from 'services'

let _isConnected = false
let _chainId;
let _account;
let _provider;
let _signer;

const events = new EventTarget()

const EVENTS = {
  CONNECTED: 1,
}

const provider = {
  
  // whether we have a web3 connection or not
  isConnected: () => _isConnected,

  EVENTS,

  // connect to web3 via metamask
  connectMetamask: async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('NO_PROVIDER')
    }
    if (!window.ethereum.isMetaMask) {
      throw new Error('NOT_METAMASK')
    }
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    _account = accounts[0]
    _isConnected = true
    
    // we put a timeout here to let react
    // components digest the connection first
    setTimeout(() => {
      events.dispatchEvent(
        new Event(EVENTS.CONNECTED)
      )
    }, 1)

    window.ethereum.on('accountsChanged', () => {
      window.location.reload()
    })

    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })
  },

  // get the account
  getAccount: () => {
    return _account
  },

  // get api client
  buildAPI: () => {
    if (_isConnected) {
      _chainId = window.ethereum.chainId ? parseInt(window.ethereum.chainId, 16) : parseInt(services.environment.DEFAULT_CHAIN_ID, 16) 
      _provider = new ethers.providers.Web3Provider(window.ethereum)
    } else {
      _chainId = services.environment.DEFAULT_CHAIN_ID
      _provider = new ethers.providers.JsonRpcProvider(services.environment.DEFAULT_PROVIDER_URL)
    }
    _signer = _provider.getSigner()
    return new API(_chainId, _account, _signer);
  },

  // listen for changes 
  addEventListener: (eventName, callback) => {
    events.addEventListener(eventName, callback)
  },

  // stop listening for changes
  removeEventListener: (eventName, callback) => {
    events.removeEventListener(eventName, callback)
  },
}

export default provider
