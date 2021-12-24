//
// This service is responsible for
// interacting with the chain.
// Portions of this service will be 
// extracted later for the public
// API clients.
//
//import client from '@avvy/client'
import artifacts from '@avvy/artifacts'
import { ethers } from 'ethers'
const circomlibjs = require('circomlibjs')
//import client from '@avvy/client'
//const client = require('@avvy/client')
////console.log(client)
const client = 'wat'

circomlibjs.buildPoseidon()


class AvvyClient {
  constructor(chainId, account, signer) {
    const contracts = artifacts.contracts[chainId]
    this.contracts = {}
    for (let key in contracts) {
      this.contracts[key] = new ethers.Contract(
        contracts[key].address,
        contracts[key].abi,
        signer
      )
    }

    this.account = account
  }

  async loadDomain(domain) {
    // hash the name
    
     //console.log(client)
     //const client = 'wat'
     debugger
    const hash = await client.nameHash(domain)
    const owner = await this.contracts.Domain.ownerOf(hash)


    // check if the name has an owner

    // check if we're in the auction period

    // check if bidding is closed

    /*
    CAN_REGISTER: 1,
    CAN_BID: 2,
    BIDDING_CLOSED: 3,
    UNAVAILABLE: 4,
    */
  }
}

export default AvvyClient
