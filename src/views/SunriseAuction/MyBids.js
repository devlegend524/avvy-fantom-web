import React from 'react'
import { connect } from 'react-redux'
import { ethers } from 'ethers'
import { TrashIcon } from '@heroicons/react/solid'

import components from 'components'
import services from 'services'

import actions from './actions'
import selectors from './selectors'

import AuctionPhase from './AuctionPhase'
import BidFlow from './BidFlow'
import RevealFlow from './RevealFlow'
import Summary from './Summary'



class MyBids extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: services.provider.isConnected()
    }
  }

  onConnect() {
    setTimeout(() => {
      this.setState({
        isConnected: services.provider.isConnected(),
      })
      this.props.loadWinningBids(true)
    }, 1)
  }

  componentDidMount() {
    this.props.loadAuctionPhases()
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  componentWillUnmount() {
    services.provider.removeEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  onCompleteBidFlow() {
    this.bidModal.toggle()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.auctionPhases) {
      const claimStartsAt = this.props.auctionPhases[2] * 1000
      const claimEndsAt = this.props.auctionPhases[3] * 1000
      const now = parseInt(Date.now())
      if (now >= claimStartsAt && now < claimEndsAt) {
        this.props.loadWinningBids()
      }
    }
  }

  renderNoBids() {
    return (
      <>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{'My Bids'}</div>
        <div className='max-w-md m-auto'>
          <div className='mb-8'>
            <components.labels.Information text={"You haven't placed any bids"} />
          </div>
          <components.DomainSearch />
        </div>
      </>
    )
  }

  renderOver() {
    return (
      <div className='max-w-screen-md m-auto mt-4'>
        <div className='text-center font-bold text-lg'>{'The Sunrise Auction is over'}</div>
        <div className='text-center'>{'You may now register any domains that are still available.'}</div>
        <div className='max-w-sm m-auto mt-8'>
          <components.buttons.Button text={'View My Domains'} onClick={(navigator) => services.linking.navigate(navigator, 'MyDomains')} />
        </div>
        <div className='max-w-sm m-auto mt-4'>
          <components.DomainSearch />
        </div>
      </div>
    )
  }

  renderClaim() {
    const claimEndsAt = this.props.auctionPhases[3] * 1000
    const later = Date.now() + 60 * 60 * 365 * 2000000
    const isSubmitted = (name) => this.props.unsubmittedBidNames.indexOf(name) === -1
    const isRevealed = (name) => this.props.revealedBidNames.indexOf(name) > -1
    const bids = this.props.bids
    const keys = Object.keys(bids).sort().filter(name => isSubmitted(name))
    const nameData = this.props.nameData
    let bidTotal = ethers.BigNumber.from('0')
    let registrationTotal = ethers.BigNumber.from('0')
    let hasAllKeys = true
    let allClaimed = true
    let auctionResults = this.props.auctionResults
    keys.forEach(key => {
      if (this.props.winningBidsLoaded && this.state.isConnected && auctionResults) {
        if (auctionResults[key] && auctionResults[key].isWinner) {
          bidTotal = bidTotal.add(ethers.BigNumber.from(auctionResults[key].auctionPrice))
          registrationTotal = registrationTotal.add(ethers.BigNumber.from(nameData[key].priceUSDCents))
        }
      } else {
        bidTotal = bidTotal.add(ethers.BigNumber.from(bids[key]))
        registrationTotal = registrationTotal.add(ethers.BigNumber.from(nameData[key].priceUSDCents))
      }
      if (!nameData[key]) {
        hasAllKeys = false
        return
      }
      if (this.props.claimedNames && !this.props.claimedNames[key] && auctionResults[key] && auctionResults[key].type !== 'IS_CLAIMED') allClaimed = false
    })

    if (!hasAllKeys) return null

    if (keys.length === 0) return (
      <>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{'No valid bids.'}</div>
        <div className='max-w-md m-auto'>
          <div className='mb-8'>
            <components.labels.Information text={"The bid placement phase of the auction is over. Unfortunately you cannot place a bid at this stage. Domains will be available for on-demand registration after the auction is complete."} />
          </div>
        </div>
      </>
    )

    return (
      <>
        <div className='md:flex md:mt-2 md:mx-4'>
          <div className='w-full md:mr-8'>
            <div>
              <div className='mt-4 text-lg text-center font-bold md:text-left md:mt-0 md:text-xl'>{'My Bids - Claim'}</div>
              <div className='text-md text-left text-gray-500 mb-4 max-w-sm m-auto md:text-left md:m-0'>{'During this stage you must claim the auctions you have won.'}</div>
              <div className='mb-8 mt-4'></div>
            </div>
            <div className='mb-8'>
              {this.state.isConnected ? null : (
                <>
                  <components.labels.error text={'connect your wallet to see auction results & claim domains'} justify='justify-flex-start' />
                  <div classname='mt-4 max-w-sm md:hidden'>
                    <components.buttons.button text={'connect wallet'} />
                  </div>
                </>
              )}
            </div>
            {keys.map((key, index) => {
              const result = this.props.auctionResults[key]
              if (!result) return null
              return (
                <div className='bg-gray-100 rounded-lg p-4 mb-4' key={index}>
                  <div className='font-bold'>{key}</div>
                  <div className=''>Your Bid: {services.money.renderWAVAX(bids[key])}</div>
                  <div className=''>Yearly registration fee: {services.money.renderUSD(nameData[key].priceUSDCents)}</div>
                  {this.state.isConnected ? (
                    <div className='flex mt-2'>
                      <div className='mr-2'>
                        {result.type === 'NO_WINNER' ? (
                          <components.labels.Error text={'No participants have enough WAVAX to claim'} size={'xs'} />
                        ) : this.props.claimedNames[key] ? (
                          <components.labels.Success text={'You have claimed this name'} />
                        ) : result.type === 'IS_CLAIMED' ? (
                          <components.labels.Error text={'You lost this auction'} />
                        ) : result.isWinner ? (
                          <components.labels.Information text={'You have won this auction'} />
                        ) : (
                          <components.labels.Error text={'You lost this auction'} />
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
          <div className='max-w-md m-auto mt-8 md:w-full md:max-w-sm md:bg-gray-100 md:rounded-lg md:p-4 md:mt-0 md:flex-shrink-0'>
            <Summary.FullSummary  
              subtitle={this.props.winningBidsLoaded && this.state.isConnected ? '(Totals for auctions that you won)' : null}
              bidTotal={bidTotal} 
              registrationTotal={registrationTotal} 
              showAvailable={!(this.state.isConnected && allClaimed)} 
              notConnectedLabel={'Connect your wallet to see auction results & claim domains'}
            />
            {this.state.isConnected ? (
              <>
                {allClaimed ? null : (
                  <div className='mt-8'>
                    <div className='font-bold text-center mb-4 text-lg'>{"Next auction phase:"}</div>
                    <AuctionPhase name='Claim period over' startsAt={claimEndsAt} endsAt={later} />
                  </div>
                )}
                <div className='mt-4 max-w-sm m-auto'>
                  {allClaimed ? (
                    <>
                      <components.labels.Success text={'You have claimed all of the auctions you won. Congratulations!'} />
                      <div className='mt-4'>
                        <components.buttons.Button text={'View Domains'} onClick={(navigator) => services.linking.navigate(navigator, 'MyDomains')} />
                      </div>
                    </>
                  ) : (
                    <components.buttons.Button text={'Claim All'} onClick={() => this.props.claimAll()} loading={this.props.isClaimingDomains} />
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </>
    )
  }


  renderBidReveal() {
    const claimStartsAt = this.props.auctionPhases[2] * 1000
    const claimEndsAt = this.props.auctionPhases[3] * 1000
    const isSubmitted = (name) => this.props.unsubmittedBidNames.indexOf(name) === -1
    const isRevealed = (name) => this.props.revealedBidNames.indexOf(name) > -1
    const bids = this.props.bids
    const keys = Object.keys(bids).sort().filter(name => isSubmitted(name))
    const allRevealed = keys.reduce((sum, curr) => {
      if (!sum) return false
      if (!isRevealed(curr)) return false
      return true
    }, true)
    const nameData = this.props.nameData
    let bidTotal = ethers.BigNumber.from('0')
    let registrationTotal = ethers.BigNumber.from('0')
    let hasAllKeys = true
    keys.forEach(key => {
      bidTotal = bidTotal.add(ethers.BigNumber.from(bids[key]))
      if (!nameData[key]) {
        hasAllKeys = false
        return
      }
      registrationTotal = registrationTotal.add(ethers.BigNumber.from(nameData[key].priceUSDCents))
    })

    if (!hasAllKeys) return null

    if (keys.length === 0) return (
      <>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{'No valid bids.'}</div>
        <div className='max-w-md m-auto'>
          <div className='mb-8'>
            <components.labels.Information text={"The bid placement phase of the auction is over. Unfortunately you cannot place a bid at this stage. Domains will be available for on-demand registration after the auction is complete."} />
          </div>
        </div>
      </>
    )

    return (
      <>
        <components.Modal ref={(ref) => {
          this.revealModal = ref
        }} onClose={() => {
          if (this.disableRevealModalWarning) return true
          const answer = window.confirm('Closing this window will abandon your bid reveal. Are you sure you want to proceed?')
          return answer
        }}> 
          <RevealFlow onComplete={() => {
            this.disableRevealModalWarning = true
            this.revealModal.toggle()
            this.disableRevealModalWarning = false
          }} bidTotal={bidTotal} registrationTotal={registrationTotal} />
        </components.Modal>
        <div className='md:flex md:mt-2 md:mx-4'>
          <div className='w-full md:mr-8'>
            <div>
              <div className='mt-4 text-lg text-center font-bold md:text-left md:mt-0 md:text-xl'>{'My Bids - Bid Reveal'}</div>
              <div className='text-md text-left text-gray-500 mb-4 max-w-sm m-auto md:text-left md:m-0'>{'During this stage you must reveal your submitted bids & authorize payment in WAVAX.'}</div>
              <div className='mb-8 mt-4'></div>
            </div>
            <div className='mb-8'>
              {allRevealed ? (
                <components.labels.Success text={'All of your bids have been revealed.'} justify='justify-flex-start' />
              ) : (
                <components.labels.Information text={'Some of your bids are not revealed.'} justify='justify-flex-start' />
              )}
            </div>
            {keys.map((key, index) => {
              const _isRevealed = isRevealed(key)
              return (
                <div className='bg-gray-100 rounded-lg p-4 mb-4' key={index}>
                  <div className='font-bold'>{key}</div>
                  <div className=''>Your Bid: {services.money.renderWAVAX(bids[key])}</div>
                  <div className=''>Yearly registration fee: {services.money.renderUSD(nameData[key].priceUSDCents)}</div>
                  <div className='flex mt-2'>
                    <div className='mr-2'>
                      {_isRevealed ? (
                        <components.labels.Success text={'Bid revealed'} />
                      ) : (
                        <components.labels.Error text={'Bid not revealed'} />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className='max-w-md m-auto mt-8 md:w-full md:max-w-sm md:bg-gray-100 md:rounded-lg md:p-4 md:mt-0 md:flex-shrink-0'>
            <div className='mb-8'>
              <Summary.FullSummary bidTotal={bidTotal} registrationTotal={registrationTotal} showAvailable={allRevealed} />
            </div>
            {allRevealed ? 
              <div>
                <div className='font-bold text-center mb-4 text-lg'>{"Next auction phase:"}</div>
                <AuctionPhase name='Claim' startsAt={claimStartsAt} endsAt={claimEndsAt} />
              </div>
            : (
              <components.buttons.Button text={'Reveal Bids'} onClick={() => this.revealModal.toggle()} />
            )}
          </div>
        </div>
      </>
    )
  }

  renderBidPlacement() {
    const bidRevealStartsAt = this.props.auctionPhases[1] * 1000
    const claimStartsAt = this.props.auctionPhases[2] * 1000
    const isSubmitted = (name) => this.props.unsubmittedBidNames.indexOf(name) === -1
    const bids = this.props.bids
    const keys = Object.keys(bids).sort()
    const allSubmitted = keys.reduce((sum, curr) => {
      if (!sum) return false
      if (!isSubmitted(curr)) return false
      return true
    }, true)
    const nameData = this.props.nameData
    let bidTotal = ethers.BigNumber.from('0')
    let registrationTotal = ethers.BigNumber.from('0')
    let hasAllKeys = true
    keys.forEach(key => {
      bidTotal = bidTotal.add(ethers.BigNumber.from(bids[key]))
      if (!nameData[key]) {
        hasAllKeys = false
        return
      }
      registrationTotal = registrationTotal.add(ethers.BigNumber.from(nameData[key].priceUSDCents))
    })

    if (!hasAllKeys) return null

    if (keys.length === 0) return this.renderNoBids()

    return (
      <div className='md:flex md:px-4 md:mt-2'>
        <div className='w-full md:mr-8'>
          <div className='mt-4 text-lg text-center font-bold md:text-left md:text-lg md:mt-0'>{'My Bids - Bid Placement'}</div>
          <div className='text-md text-left text-gray-500 mb-4 max-w-sm m-auto md:text-left md:m-0'>{'During this stage, you must place your sealed bids. No one will know the domain or price of your bid.'}</div>
          <div className='mb-8 mt-4'>
            {allSubmitted ? (
              <components.labels.Success text={'All of your bids have been submitted.'} justify='justify-flex-start' />
            ) : (
              <components.labels.Information text={'Some of your bids are not submitted.'} justify='justify-flex-start' />
            )}
          </div>
          <components.Modal ref={(ref) => {
            this.bidModal = ref
          }} onClose={() => {
            if (this.disableBidModalWarning) return true
            const answer = window.confirm('Closing this window will abandon your bid placement. Are you sure you want to proceed?')
            return answer
          }}> 
            <BidFlow onComplete={() => {
              this.disableBidModalWarning = true
              this.bidModal.toggle()
              this.disableBidModalWarning = false
            }} />
          </components.Modal>
          {keys.map((key, index) => {
            const _isSubmitted = isSubmitted(key)
            return (
              <div className='bg-gray-100 rounded-lg p-4 mb-4' key={index}>
                <div className='font-bold'>{key}</div>
                <div className=''>Your Bid: {services.money.renderWAVAX(bids[key])}</div>
                <div className=''>Yearly registration fee: {services.money.renderUSD(nameData[key].priceUSDCents)}</div>
                <div className='flex mt-2'>
                  <div className='mr-2'>
                    {_isSubmitted ? (
                      <components.labels.Success text={'Bid submitted'} size={'xs'} />
                    ) : (
                      <components.labels.Error text={'Bid not submitted'} size={'xs'} />
                    )}
                  </div>
                  {_isSubmitted ? null : (
                    <div className='flex items-end cursor-pointer' onClick={() => this.props.deleteBid(key)}>
                      <TrashIcon className='w-4' />
                      <div className='font-bold text-xs ml-1'>{"Delete"}</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className='max-w-sm w-full m-auto mt-8 md:flex-shrink-0 md:ml-4 md:pl-4 md:mt-0 md:bg-gray-100 md:rounded-lg md:p-4'>
          <div className='mb-8'>
            <Summary.FullSummary bidTotal={bidTotal} registrationTotal={registrationTotal} />
          </div>
          {allSubmitted ? (
            <div>
              <div className='font-bold text-center mb-4 text-lg'>{"Next auction phase:"}</div>
              <AuctionPhase name='Bid reveal' startsAt={bidRevealStartsAt} endsAt={claimStartsAt} />
            </div>
          ) : (
            <components.buttons.Button text={'Place Bids'} onClick={() => this.bidModal.toggle()} />
          )}
        </div>
      </div>
    )
  }

  renderConnect() {
    return ( 
      <div className='max-w-screen-md m-auto'>
        <components.Modal ref={(ref) => this.connectModal = ref} title={'Connect your wallet'}> 
          <components.ConnectWallet />
        </components.Modal>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{"My Bids"}</div>
        <div className='max-w-md m-auto'>
          <components.labels.Information text={'You must be connected to a wallet to view your bids'} />
          <div className='mt-8'>
            <components.buttons.Button text={'Connect your wallet'} onClick={() => this.connectModal.toggle()} />
          </div>
        </div>
      </div>
    )
  }

  render() {
    if (!this.props.auctionPhases) return null
    if (!this.state.isConnected) return this.renderConnect()
    const bidPlacementStartsAt = this.props.auctionPhases[0] * 1000
    const bidRevealStartsAt = this.props.auctionPhases[1] * 1000
    const claimStartsAt = this.props.auctionPhases[2] * 1000
    const claimEndsAt = this.props.auctionPhases[3] * 1000
    const end = new Date((claimEndsAt + 60 * 60 * 24 * 365 * 100) * 1000)
    const now = parseInt(Date.now())
    if (now >= bidPlacementStartsAt && now < bidRevealStartsAt) return this.renderBidPlacement()
    if (now >= bidRevealStartsAt && now < claimStartsAt) return this.renderBidReveal()
    if (now >= claimStartsAt && now < claimEndsAt) return this.renderClaim()
    return this.renderOver()
  }
}

const mapStateToProps = (state) => ({
  bids: services.sunrise.selectors.bids(state),
  nameData: services.sunrise.selectors.nameData(state),
  auctionPhases: selectors.auctionPhases(state),
  unsubmittedBidNames: services.sunrise.selectors.unsubmittedBidNames(state),
  revealedBidNames: services.sunrise.selectors.revealedBidNames(state),
  auctionResults: selectors.auctionResults(state),
  isClaimingDomains: selectors.isClaimingDomains(state),
  claimedNames: services.sunrise.selectors.claimedNames(state),
  winningBidsLoaded: selectors.winningBidsLoaded(state),
})

const mapDispatchToProps = (dispatch) => ({
  loadAuctionPhases: () => dispatch(actions.loadAuctionPhases()),
  deleteBid: (key) => dispatch(services.sunrise.actions.deleteBid(key)),
  loadWinningBids: (force) => dispatch(actions.loadWinningBids(force)),
  claimAll: () => dispatch(actions.claimAll()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyBids)
