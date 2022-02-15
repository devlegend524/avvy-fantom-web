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

const chainlinkAbi = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]

class AvvyClient {
  constructor(chainId, account, signer) {
    this.chainId = chainId
    this.contracts = artifacts.contracts.load(chainId, signer)

    this.account = account
    this.signer = signer
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

  async getDomainCountForOwner(account) {
    const count = await this.contracts.Domain.balanceOf(account)
    return parseInt(count.toString())
  }

  async getDomainIDsByOwner(account) {
    const domainCount = await this.getDomainCountForOwner(account)
    let domains = []
    for (let i = 0; i < domainCount; i += 1) {
      let id = await this.contracts.Domain.tokenOfOwnerByIndex(account, i.toString())
      domains.push(id)
    }
    return domains
  }

  async isAuctionPeriod(auctionPhases) {
    const biddingStartsAt = parseInt(auctionPhases[0]) * 1000
    const claimEndsAt = parseInt(auctionPhases[3]) * 1000
    const now = parseInt(Date.now())
    return now >= biddingStartsAt && now < claimEndsAt
  }

  async isBiddingOpen(auctionPhases) {
    const biddingStartsAt = parseInt(auctionPhases[0]) * 1000
    const revealStartsAt = parseInt(auctionPhases[1]) * 1000
    const now = parseInt(Date.now())
    return now >= biddingStartsAt && now < revealStartsAt 
  }

  async isRegistrationPeriod() {
    return true
  }

  // ESTIMATE
  async getNamePrice(domain) {
    const name = domain.split('.')[0]
    let priceUSDCents = '500'
    if (name.length === 3) {
      priceUSDCents = '64000'
    } else if (name.length === 4) {
      priceUSDCents = '16000'
    }
    return priceUSDCents
  }

  async getNameExpiry(hash) {
    const expiresAt = await this.contracts.Domain.getDomainExpiry(hash)
    return parseInt(expiresAt.toString())
  }

  async getNamePriceAVAX(domain, conversionRate) {
    const _priceUSD = await this.getNamePrice(domain)
    const priceUSD = ethers.BigNumber.from(_priceUSD)
    const priceAVAX = priceUSD.mul(conversionRate)
    return priceAVAX
  }

  isSupported(name) {
    // checks whether a given name is supported by the system
    const split = name.split('.')
    if (split.length !== 2) return false
    if (split[1] !== 'avax') return false
    if (split[0].length < 3) return false
    if (split[0].length > 62) return false
    if (!split[0].match(/^[a-z0-9][a-z0-9-]+[a-z0-9]$/)) return false
    if (split[0].length >= 4 && split[0][2] === '-' && split[0][3] === '-') return false
    return true
  }

  async getAVAXConversionRateFromChainlink(address) {
    let oracle = new ethers.Contract(address, chainlinkAbi, this.signer)
    let roundData = await oracle.latestRoundData()
    return roundData[1].toString()
  }

  async getAVAXConversionRate() {
    // this is just fixed price for now based on latestRound from oracle
    let rate
    if (this.chainId === 31337) {
      rate = ethers.BigNumber.from('10000000000')
    } else if (this.chainId === 43113) {
      rate = await this.getAVAXConversionRateFromChainlink('0x5498BB86BC934c8D34FDA08E81D444153d0D06aD')
    } else if (this.chainId === 43114) {
      rate = await this.getAVAXConversionRateFromChainlink('0x0A77230d17318075983913bC2145DB16C7366156')
    }
    return ethers.BigNumber.from('10').pow('24').div(rate)
  }

  async loadDomain(domain) {
    
    // hash the name
    const hash = await client.nameHash(domain)
    const tokenExists = await this.tokenExists(hash)
    const auctionPhases = await this.getAuctionPhases()
    const isAuctionPeriod = await this.isAuctionPeriod(auctionPhases)
    const isBiddingOpen = await this.isBiddingOpen(auctionPhases)
    const isRegistrationPeriod = await this.isRegistrationPeriod()
    let domainStatus
    let owner = null

    if (tokenExists) {
      owner = await this.ownerOf(hash)
      if (owner && this.account && owner.toLowerCase() === this.account.toLowerCase()) domainStatus = this.DOMAIN_STATUSES.REGISTERED_SELF
      else domainStatus = this.DOMAIN_STATUSES.REGISTERED_OTHER
    } else if (isAuctionPeriod && isBiddingOpen) {
      domainStatus = this.DOMAIN_STATUSES.AUCTION_AVAILABLE
    } else if (isAuctionPeriod && !isBiddingOpen) {
      domainStatus = this.DOMAIN_STATUSES.AUCTION_BIDDING_CLOSED
    } else if (isRegistrationPeriod) {
      domainStatus = this.DOMAIN_STATUSES.AVAILABLE
    }

    let priceUSDCents = await this.getNamePrice(domain)
    let avaxConversionRate = await this.getAVAXConversionRate()
    let priceAVAXEstimate = avaxConversionRate.mul(ethers.BigNumber.from(priceUSDCents)).toString()
    let expiresAt = await this.getNameExpiry(hash)


    return {
      constants: {
        DOMAIN_STATUSES: this.DOMAIN_STATUSES,
      },
      supported: this.isSupported(domain),
      domain,
      hash: hash.toString(),
      owner,
      expiresAt,
      status: domainStatus,
      priceUSDCents,
      priceAVAXEstimate,
      timestamp: parseInt(Date.now() / 1000),
    }
  }

  async generateDomainPriceProof(domain) {
    const domainSplit = domain.split('.')
    const name = domainSplit[0]
    const nameArr = await client.string2AsciiArray(name, 62)
    const namespace = domainSplit[domainSplit.length - 1]
    const namespaceHash = await client.nameHash(namespace)
    const hash = await client.nameHash(domain)
    let minLength = name.length
    if (name.length >= 6) minLength = 6
    const inputs = {
      namespaceId: namespaceHash.toString(),
      name: nameArr,
      hash: hash.toString(),
      minLength
    }
    const proveRes = await services.circuits.prove('PriceCheck', inputs)
    const verify = await services.circuits.verify('PriceCheck', proveRes)
    if (!verify) throw new Error('Failed to verify')
    const calldata = await services.circuits.calldata(proveRes)
    return {
      proveRes,
      calldata
    }
  }

  async generateConstraintsProof(domain) {
    const split = domain.split('.')
    const _name = split[0]
    const _namespace = split[1]
    const namespace = await client.string2AsciiArray(_namespace, 62)
    const name = await client.string2AsciiArray(_name, 62)
    const hash = await client.nameHash(domain)
    const inputs = {
      namespace,
      name,
      hash: hash.toString(),
    }
    const proveRes = await services.circuits.prove('Constraints', inputs)
    const verify = await services.circuits.verify('Constraints', proveRes)
    if (!verify) throw new Error('Failed to verify')
    const calldata = await services.circuits.calldata(proveRes)
    return {
      proveRes,
      calldata
    }
  }

  async commit(domains, quantities, constraintsProofs, pricingProofs, salt) {
    let hashes = []
    for (let i = 0; i < domains.length; i += 1) {
      let hash = await client.nameHash(domains[i])
      hashes.push(hash.toString())
    }
    const hash = await client.registrationCommitHash(hashes, quantities, constraintsProofs, pricingProofs, salt)
    const tx = await this.contracts.LeasingAgentV1.commit(hash)
    await tx.wait()
    return hash
  }

  async register(domains, quantities, constraintsProofs, pricingProofs, salt) {
    let hashes = []
    let total = ethers.BigNumber.from('0')
    const conversionRate = await this.getAVAXConversionRate()

    for (let i = 0; i < domains.length; i += 1) {
      let hash = await client.nameHash(domains[i])
      hashes.push(hash.toString())
      let namePrice = await this.getNamePriceAVAX(domains[i], conversionRate)
      total = total.add(
        ethers.BigNumber.from(quantities[i].toString()).mul(
          namePrice
        )
      )
    }

    const registerTx = await this.contracts.LeasingAgentV1.register(hashes, quantities, constraintsProofs, pricingProofs, salt, {
      value: total
    })
    await registerTx.wait()
  }

  async getAuctionPhases() {
    const now = parseInt(Date.now() / 1000)
    if (this._auctionPhasesCache && now - this._auctionPhasesCachedAt < 60 * 5) return this._auctionPhasesCache
    const params = await this.contracts.SunriseAuctionV1.getAuctionParams()
    const phases = params.map(p => parseInt(p.toString()))
    this._auctionPhasesCache = phases
    this._auctionPhasesCachedAt = now
    return phases
  }

  async bid(hash) {
    const tx = await this.contracts.SunriseAuctionV1.bid(hash)
    await tx.wait()
  }

  async reveal(names, amounts, salt) {
    const tx = await this.contracts.SunriseAuctionV1.reveal(names, amounts, salt)
    await tx.wait()
  }

  async getWinningBid(name) {
    const hash = await client.nameHash(name)
    let result
    try {
      const output = await this.contracts.SunriseAuctionV1.getWinningBid(hash.toString())
      try {
        const owner = await this.ownerOf(hash.toString())
        result = {
          type: 'IS_CLAIMED',
          owner,
          winner: output.winner,
          auctionPrice: output.auctionPrice.toString(),
          isWinner: output.winner.toLowerCase() === this.account
        }
      } catch (err) {
        result = {
          type: 'HAS_WINNER',
          winner: output.winner,
          auctionPrice: output.auctionPrice.toString(),
          isWinner: output.winner.toLowerCase() === this.account
        }
      }
    } catch (err) {
      result = {
        type: 'NO_WINNER'
      }
      console.log(err)
    }
    return result
  }

  getWavaxContract() {
    let contract
    if (this.chainId === 31337) {
      contract = this.contracts.MockWavax
    } else {
    }
    return contract
  }

  async getWavaxBalance() {
    const contract = this.getWavaxContract()
    const balance = await contract.balanceOf(this.account)
    return balance.toString()
  }

  async getAuctionWavax() {
    const contract = this.getWavaxContract()
    const allowance = await contract.allowance(this.account, this.contracts.SunriseAuctionV1.address)
    return allowance.toString()
  }

  async approveWavaxForAuction(amount) {
    const contract = this.getWavaxContract()
    const tx = await contract.approve(this.contracts.SunriseAuctionV1.address, amount) 
    await tx.wait()
  }

  async sunriseClaim(names, constraintsData) {
    const hashes = []
    for (let i = 0; i < names.length; i += 1) {
      let hash = await client.nameHash(names[i])
      hashes.push(hash.toString())
    }
    await this.contracts.SunriseAuctionV1.claim(hashes, constraintsData)
  }

  async checkHasAccount() {
    // check if there is an account on-chain
    const hasAccount = await this.contracts.AccountGuardV1.addressHasAccount(this.account)
    return hasAccount
  }

  async submitAccountVerification(signature) {
    const _ethers = ethers
    const address = this.account
    function getMessage(address) {
      return ethers.utils.arrayify(
        ethers.utils.solidityKeccak256(["string", "address"], ["HAS-ACCOUNT-", address])
      );
    }
    const hash = getMessage(address)
    const sig = signature
    const recoveredAddress = ethers.utils.recoverAddress(hash, sig)

    await this.contracts.AccountGuardV1.verify(ethers.utils.getAddress(this.account), signature)
  }
}

export default AvvyClient
