//
// This service is responsible for
// interacting with the chain.
// Portions of this service will be 
// extracted later for the public
// API clients.
//
import artifacts from '@avvy/artifacts'
import { ethers } from 'ethers'
import client from '@avvy/client'

import services from 'services'

async function loadWasm(name) {
  const path = services.linking.static(`circuits/${name}.wasm`);
  const importObject = {
    imports: {
      imported_func: function (arg) {
      },
      wasi_unstable: () => {}
    },
    env: {
      memoryBase: 0,
      tableBase: 0,
      memory: new WebAssembly.Memory({initial: 256, maximum: 1024}),
      table: new WebAssembly.Table({initial: 256, element: 'anyfunc'}),
      __assert_fail: function() {
        // todo
      },
      emscripten_resize_heap: function() {
        // todo
      },
      emscripten_memcpy_big: function() {
        // todo
      },
      setTempRet0: function() {
        // todo
      }
    }
  };
  const obj = await WebAssembly.instantiateStreaming(window.fetch(path), importObject)
  return obj
}

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
    this.DOMAIN_STATUSES = [
      'AVAILABLE',
      'AUCTION_AVAILABLE',
      'AUCTION_BIDDING_CLOSED',
      'REGISTERED_OTHER',
      'REGISTERED_SELF',
    ].reduce((sum, curr) => {
      sum[curr] = curr
      return sum
    }, {})
  }

  async tokenExists(hash) {
    const exists = await this.contracts.Domain.exists(hash)
    return exists
  }
  
  async ownerOf(hash) {
    const owner = await this.contracts.Domain.ownerOf(hash)
    return owner
  }

  async isAuctionPeriod() {
    return false
  }

  async isBiddingOpen() {
    return false
  }

  async isRegistrationPeriod() {
    return true
  }

  async loadDomain(domain) {
    
    // hash the name
    const hash = await client.nameHash(domain)
    const tokenExists = await this.tokenExists(hash)
    const isAuctionPeriod = await this.isAuctionPeriod()
    const isBiddingOpen = await this.isBiddingOpen()
    const isRegistrationPeriod = await this.isRegistrationPeriod()
    let domainStatus
    let owner = null

    if (tokenExists) {
      owner = await this.ownerOf(hash)
      if (owner === this.account) domainStatus = this.DOMAIN_STATUSES.REGISTERED_SELF
      else domainStatus = this.DOMAIN_STATUSES.REGISTERED_OTHER
    } else if (isRegistrationPeriod) {
      domainStatus = this.DOMAIN_STATUSES.AVAILABLE
    } else if (isAuctionPeriod && isBiddingOpen) {
      domainStatus = this.DOMAIN_STATUSES.AUCTION_AVAILABLE
    } else if (isAuctionPeriod && !isBiddingOpen) {
      domainStatus = this.DOMAIN_STATUSES.AUCTION_BIDDING_CLOSED
    }

    //await this.getDomainPriceProof(domain)

    return {
      constants: {
        DOMAIN_STATUSES: this.DOMAIN_STATUSES,
      },
      domain,
      owner,
      status: domainStatus,
      priceUSDText: '$15.00 USD',
      priceUSDCents: ethers.BigNumber.from('1500'),
    }
  }

  async getDomainPriceProof(domain) {
    const domainSplit = domain.split('.')
    const name = await client.string2AsciiArray(domain, 62)
    const namespace = domainSplit[domainSplit.length - 1]
    const namespaceHash = await client.nameHash(namespace)
    const hash = await client.nameHash(domain)
    const minLength = 6
    const wasm = await loadWasm('PriceCheck')
    const { proof, publicSignals } = await window.snarkjs.plonk.fullProve( 
      {
        namespaceId: namespaceHash.toString(),
        name,
        hash: hash.toString(),
        minLength
      },
      wasm,
      //services.linking.static('circuits/PriceCheck.wasm'), 
      services.linking.static('circuits/PriceCheck_final.zkey')
    )
    console.log(proof, publicSignals)

    /*
    proofCompnent.innerHTML = JSON.stringify(proof, null, 1);


    const vkey = await fetch("verification_key.json").then( function(res) {
        return res.json();
    });

    */
  }
}

export default AvvyClient
