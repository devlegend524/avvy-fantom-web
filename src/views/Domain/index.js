import React from 'react'
import { connect } from 'react-redux'
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/solid'
import { InformationCircleIcon, PlusIcon } from '@heroicons/react/outline' 
import services from 'services'
import components from 'components'

import AddBid from './AddBid'
import SetRecord from './SetRecord'
import SetResolver from './SetResolver'
import actions from './actions'
import constants from './constants'
import reducer from './reducer'
import selectors from './selectors'


class Domain extends React.PureComponent {
  constructor(props) {
    super(props)
    const params = services.linking.getParams('Domain')
    const domain = params.domain ? params.domain.toLowerCase() : null
    this.state = {
      domain: domain,
      connected: services.provider.isConnected(),
      setRecordReset: 0, // increment this to reset the form
      defaultResolver: undefined,
    }
    this.searchPlaceholder = 'Search for another name'
    this.loadDomain(domain)
  }

  async setDefaultResolver() { 
    const api = await services.provider.buildAPI()
    console.log('setting default resolver')
    this.setState({
      defaultResolver: api.getDefaultResolverAddress()
    }, () => {
      console.log('default', this.state.defaultResolver)
    })
  }

  updateParams = () => {
    const params = services.linking.getParams('Domain')
    const domain = params.domain ? params.domain.toLowerCase() : null
    this.setState({
      domain: domain
    }, () => {
      this.loadDomain(domain)
    })
  }

  loadDomain() {
    const params = services.linking.getParams('Domain')
    const domain = params.domain ? params.domain.toLowerCase() : null
    this.props.loadDomain(domain)
  }

  onConnect() {
    this.setState({
      connected: true
    })
    if (this.connectModal) this.connectModal.hide()
    this.loadDomain()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.setRecordComplete && this.props.setRecordComplete) {
      this.setRecordModal.toggle()
      this.setState(currState => ({ setRecordReset: currState.setRecordReset + 1 }))
      this.props.resetSetRecord()
    }
  }

  componentDidMount() {
    services.linking.addEventListener('Domain', this.updateParams)
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
    this.setDefaultResolver()
  }

  componentWillUnmount() {
    services.linking.removeEventListener('Domain', this.updateParams)
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  addToCart(navigator) {
    this.props.addToCart(this.state.domain)
    services.linking.navigate(navigator, 'Register', {})
  }

  bidOnName() {
    this.bidModal.toggle()
  }

  handleAddBid(navigate, value) {
    this.props.addBid(this.state.domain, value)
    services.linking.navigate(navigate, 'SunriseAuctionMyBids')
  }

  _handleSetRecord = (type, value) => {
    this.props.setStandardRecord(this.state.domain, type, value)
  }

  renderAvailableBody() {
    return (
      <div className='max-w-md m-auto'>
        <div className='max-w-sm m-auto mt-4 flex items-center justify-center'>
          <CheckCircleIcon className='w-6 text-alert-blue mr-2' />
          <div className='text-alert-blue'>{'Available for registration'}</div>
        </div>
        <div className='mt-8'>
          <components.buttons.Button 
            text={'Register this name'} 
            onClick={(navigator) => this.addToCart(navigator)} 
          />
        </div>
        <div className='mt-4'>
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
      </div>
    )
  }

  renderAuctionAvailableBody() {
    const hasBid = this.props.bids && this.props.bids[this.state.domain]
    return (
      <div className='max-w-md m-auto'>
        {hasBid ? (
          <>
            <components.labels.Success text='You have placed a bid on this name' />
            <div className='mt-8'>
              <components.buttons.Button text={'View my bids'} onClick={(navigator) => services.linking.navigate(navigator, 'SunriseAuctionMyBids')} />
            </div>
          </>
        ) : (
          <>
            <components.labels.Success text='Available for auction' />
            <div className='mt-8'>
              <components.buttons.Button text={'Bid on this name'} onClick={this.bidOnName.bind(this)} />
            </div>
          </>
        )}
        <div className='mt-4'>
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
      </div>
    )
  }

  renderAuctionBiddingClosedBody() {
    return (
      <div className='max-w-md m-auto'>
        <div className='max-w-sm m-auto mt-4'>
          <components.labels.Information text={'This name is up for auction'} />
        </div>
        <div className='mt-4 bg-gray-100 rounded-xl w-full relative p-8 dark:bg-gray-700'>
          <div className='font-bold'>{'Bidding period is over'}</div>
          <div>
            {'This name is undergoing the Sunrise Auction process, however bidding is closed. If there are no winning bids, this name will be available for registration after the auction completes.'}
          </div>
        </div>
        <div className='mt-4'>
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
      </div>
    )
  }

  renderUnsupported() {
    return (
      <div className='max-w-md m-auto'>
        <div className='max-w-sm m-auto mt-4 flex items-center justify-center'>
          <components.labels.Error text={'This name cannot be registered'} />
        </div>
        <div className='mt-4'>
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
      </div>
    )
  }

  renderRegistered() {
    const isOwned = services.provider.getAccount() === this.props.domain.owner.toLowerCase()
    
    return (
      <div className='max-w-screen-md m-auto flex w-full md:flex-row md:items-start'>
        <components.Modal title={'Set Record'} ref={(ref) => this.setRecordModal = ref}>
          <SetRecord key={this.state.setRecordReset} handleSubmit={this._handleSetRecord} loading={this.props.isSettingRecord} />
        </components.Modal>
        <components.Modal title={'Set Resolver'} ref={(ref) =>  this.setResolverModal = ref}>
          <SetResolver onComplete={() => this.setResolverModal.toggle()} domain={this.state.domain} resolver={this.props.resolver} />
        </components.Modal>
        <components.Modal title={'Connect Wallet'} ref={(ref) => this.connectModal = ref}>
          <components.ConnectWallet />
        </components.Modal>
        <div className='w-full'>
          <div className='mt-4 bg-gray-100 rounded-xl w-full relative p-4 md:p-8 dark:bg-gray-800 w-full'>
            <div className='flex justify-between items-center'>
              <div className='font-bold'>{'Basic Information'}</div>
              {!this.state.connected ? (
                <components.buttons.Button sm={true} text='Connect' onClick={() => this.connectModal.toggle()} />
              ) : isOwned && services.environment.REGISTRATIONS_ENABLED ? (
                <components.buttons.Button disabled={!this.props.domain.canRenew} sm={true} text='Renew' onClick={(navigator) => {
                  this.props.renewDomain(this.props.domain.domain)
                  services.linking.navigate(navigator, 'Register')
                }} />
              ) : null}
            </div>
            <div className='w-full bg-gray-300 dark:bg-gray-700 mt-4' style={{height: '1px'}}></div>
            <div className='mt-4 text-sm'>
              <div className='font-bold'>{'Registrant'}</div>
              <div className='truncate'>
                {this.props.domain.owner}
              </div>
            </div>
            <div className='mt-4 text-sm flex items-center justify-between'>
              <div>
                <div className='font-bold'>{'Expiry'}</div>
                <div>
                  {new Intl.DateTimeFormat(
                    navigator.language,
                    { month: 'short', day: 'numeric', year: 'numeric' }
                  ).format(this.props.domain.expiresAt * 1000)}
                  {' at '}
                  {new Intl.DateTimeFormat(
                    navigator.langauge,
                    { hour: 'numeric', minute: 'numeric' }
                  ).format(this.props.domain.expiresAt * 1000)}
                </div>
              </div>
            </div>
            <div className='mt-4 text-sm'>
              <div className='font-bold'>{'Resolver'}</div>
              <div className='truncate flex items-center'>
                {this.props.resolver ? (
                  <div>{this.props.resolver.resolver === this.state.defaultResolver ? 'Default Resolver' : 'Unknown Resolver'}</div>
                ) : (
                  <div className='italic'>Not set</div>
                )}
                {this.state.connected && isOwned ? (
                  <components.buttons.Transparent onClick={() => {
                    this.props.resetSetResolver()
                    this.setResolverModal.toggle()
                  }}><div className='ml-2 inline-block cursor-pointer text-alert-blue underline'>Set Resolver</div></components.buttons.Transparent>
                ) : null}
              </div>
            </div>
          </div>
          {this.props.resolver && this.props.resolver.resolver === this.state.defaultResolver ? (
            <div className='mt-4 bg-gray-100 rounded-xl w-full relative p-4 md:p-8 dark:bg-gray-800 w-full'>
              <div className='flex justify-between items-center'>
                <div className='font-bold'>{'Records'}</div>
                {!this.state.connected ? (
                  <components.buttons.Button sm={true} text='Connect' onClick={() => this.connectModal.toggle()} />
                ) : isOwned ? (
                  <PlusCircleIcon className='cursor-pointer w-6' onClick={() => this.setRecordModal.toggle()} />
                ) : null}
              </div>
              {this.props.records.length > 0 ? (
                <div className='w-full bg-gray-300 dark:bg-gray-700 mt-4' style={{height: '1px'}}></div>
              ) : null}
              
              {this.props.isLoadingRecords ? (
                <div className='my-4 w-full text-center'>
                  <components.Spinner />
                </div>
              ) : this.props.records.map((record, index) => (
                <div className='mt-4' key={index}>
                  <div className='text-sm font-bold'>
                    {record.typeName}
                  </div>
                  <div className='text-sm truncate'>
                    {record.value}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  renderLoader() {
    return (
      <div className='m-auto max-w-sm text-center'>
        <components.Spinner className='w-6' size='md' dark={true} />
      </div>
    )
  }

  renderBody() {
    if (this.props.isLoading) return this.renderLoader()
    if (!this.props.domain) return null
    if (!this.props.domain.supported) return this.renderUnsupported()

    const statuses = this.props.domain.constants.DOMAIN_STATUSES

    switch (this.props.domain.status) {
      case statuses.AVAILABLE:
        return this.renderAvailableBody()

      case statuses.AUCTION_AVAILABLE:
        return this.renderAuctionAvailableBody()

      case statuses.AUCTION_BIDDING_CLOSED:
        return this.renderAuctionBiddingClosedBody()

      case statuses.REGISTERED_OTHER:
        return this.renderRegistered()

      case statuses.REGISTERED_SELF:
        return this.renderRegistered()
      
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <components.Modal ref={(ref) => this.bidModal = ref} title={'Add a bid'}> 
          {this.state.connected ? (
            <AddBid 
              hasSeenBidDisclaimer={this.props.hasSeenBidDisclaimer}
              setHasSeenBidDisclaimer={this.props.setHasSeenBidDisclaimer}
              domain={this.state.domain} 
              handleSubmit={(navigate, val) => this.handleAddBid(navigate, val)} />
          ) : (
            <components.ConnectWallet />
          )}
        </components.Modal>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{this.state.domain}</div>
        {this.renderBody()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: selectors.isLoading(state),
  domain: selectors.domain(state),
  bids: services.sunrise.selectors.bids(state),
  isSettingRecord: selectors.isSettingRecord(state),
  isLoadingRecords: selectors.isLoadingRecords(state),
  records: selectors.records(state),
  setRecordComplete: selectors.setRecordComplete(state),
  avatarRecord: selectors.avatarRecord(state),
  resolver: selectors.resolver(state),
  hasSeenBidDisclaimer: services.sunrise.selectors.hasSeenBidDisclaimer(state),
})

const mapDispatchToProps = (dispatch) => ({
  loadDomain: (domain) => dispatch(actions.loadDomain(domain)),
  addToCart: (domain) => dispatch(services.cart.actions.addToCart(domain)),
  addBid: (domain, amount) => dispatch(services.sunrise.actions.addBid(domain, amount)),
  setStandardRecord: (domain, type, value) => dispatch(actions.setStandardRecord(domain, type, value)),
  resetSetRecord: () => dispatch(actions.setRecordComplete(false)),
  renewDomain: (domain) => dispatch(services.cart.actions.addToCart(domain)),
  resetSetResolver: () => dispatch(actions.setResolverComplete(false)),
  setHasSeenBidDisclaimer: (value) => dispatch(services.sunrise.actions.setHasSeenBidDisclaimer(value)),
})

const component = connect(mapStateToProps, mapDispatchToProps)(Domain)

component.redux = {
  actions,
  constants,
  reducer,
  selectors,
}

export default component
