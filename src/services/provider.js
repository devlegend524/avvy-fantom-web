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
  connectMetamask: () => {
    return new Promise(async (resolve, reject) => {
      console.log(services.environment)
      if (typeof window.ethereum === 'undefined') {
        return reject('NO_PROVIDER')
      }
      if (!window.ethereum.isMetaMask) {
        return reject('NOT_METAMASK')
      }

      // verify they connected to the right chain
      const chainId = parseInt(window.ethereum.chainId, 16)
      const expectedChainId = parseInt(services.environment.DEFAULT_CHAIN_ID)
      if (chainId !== expectedChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{
              chainId: '0x' + expectedChainId.toString(16)
            }]
          })
          window.ethereum.on('chainChanged', continueInitialization)
        } catch (err) {
          if (err.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x' + expectedChainId.toString(16),
                    chainName: services.environment.DEFAULT_CHAIN_NAME,
                    rpcUrls: [services.environment.DEFAULT_PROVIDER_URL],
                  }
                ]
              })
              window.ethereum.on('chainChanged', continueInitialization)
            } catch (err) {
              return reject('WRONG_CHAIN')
            }
          } else {
            return reject('WRONG_CHAIN')
          }
        }
      } else {
        continueInitialization()
      }

      async function continueInitialization() {
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

        resolve()
      }
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
      _signer = _provider.getSigner()
      return new API(_chainId, _account, _signer);
    } else {
      _chainId = services.environment.DEFAULT_CHAIN_ID
      console.log(services.environment.DEFAULT_PROVIDER_URL)
      _provider = new ethers.providers.JsonRpcProvider(services.environment.DEFAULT_PROVIDER_URL)
      //_signer = _provider.getSigner(ethers.Wallet.createRandom().address)
      return new API(_chainId, _account, _provider)
    }
  },

  // listen for changes 
  addEventListener: (eventName, callback) => {
    events.addEventListener(eventName, callback)
  },

  // stop listening for changes
  removeEventListener: (eventName, callback) => {
    events.removeEventListener(eventName, callback)
  },

  signMessage: async (message) => {
    const sig = await window.ethereum.request({
      method: 'personal_sign',
      params: [
        message,
        _account
      ]
    })
    return sig
  }
}

export default provider
