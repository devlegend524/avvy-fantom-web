import React from 'react'
import { connect } from 'react-redux'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { InformationCircleIcon } from '@heroicons/react/outline'

import services from 'services'
import components from 'components'

import actions from './actions'
import constants from './constants'
import reducer from './reducer'
import selectors from './selectors'


class Domain extends React.PureComponent {
  constructor(props) {
    super(props)
    const params = services.linking.getParams('Domain')
    this.state = {
      domain: params.domain,
    }
    this.searchPlaceholder = 'Search for another name'
    this.props.loadDomain(params.domain)
  }

  updateParams = () => {
    const params = services.linking.getParams('Domain')
    this.setState({
      domain: params.domain
    })
    this.props.loadDomain(params.domain)
  }

  componentDidMount() {
    services.linking.addEventListener('Domain', this.updateParams)
  }

  componentWillUnmount() {
    services.linking.removeEventListener('Domain', this.updateParams)
  }

  addToCart(navigator) {
    this.props.addToCart(this.state.domain)
    services.linking.navigate(navigator, 'Register', {})
  }

  renderAvailableBody() {
    return (
      <div className='max-w-md m-auto'>
        <div className='max-w-sm m-auto mt-4 flex items-center justify-center'>
          <CheckCircleIcon className='w-6 text-alert-blue mr-2' />
          <div className='text-alert-blue'>{'Available for registration'}</div>
        </div>
        <div className='mt-8'>
          <components.Button 
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
    return (
      <div className='max-w-md m-auto'>
        <div className='max-w-sm m-auto mt-4 flex items-center justify-center'>
          <CheckCircleIcon className='w-6 text-alert-blue mr-2' />
          <div className='text-alert-blue'>{'Available for auction'}</div>
        </div>
        <div className='mt-8'>
          <components.Button text={'Bid on this name'} />
        </div>
        <div className='mt-4'>
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
      </div>
    )
  }

  renderAuctionBiddingClosedBody() {
    return (
      <div className='max-w-md m-auto'>
        <div className='max-w-sm m-auto mt-4 flex items-center justify-center'>
          <InformationCircleIcon className='w-6 text-gray-400 mr-2' />
          <div className='text-gray-400'>{'Bidding is closed'}</div>
        </div>
        <div className='mt-4'>
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
        <div className='mt-4 bg-gray-100 rounded-xl w-full relative p-8'>
          <div className='font-bold'>{'Bidding period is over'}</div>
          <div>
            {'This name is undergoing the Sunrise Auction process, however bidding is closed. If there are no winning bids, this name will be available for registration on Dec. 10.'}
          </div>
        </div>
      </div>
    )
  }

  renderOwnershipDetails() {
    return (
      <div className='mt-4 bg-gray-100 rounded-xl w-full relative p-8'>
        <div>
          <div className='font-bold'>{'Registrant'}</div>
          <div className='truncate'>
            {this.props.domain.owner}
          </div>
        </div>
        <div className='mt-4'>
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
    )
  }

  renderRegisteredSelfBody() {
    return (
      <div className='max-w-md m-auto'>
        <components.labels.Information text={'This domain is registered to your account'} />
        <div className='mt-4'>
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
        {this.renderOwnershipDetails()}
      </div>
    )
  }

  renderRegisteredOtherBody() {
    return (
      <div className='max-w-md m-auto'>
        <div className='max-w-sm m-auto mt-4 flex items-center justify-center'>
          <InformationCircleIcon className='w-6 text-alert-red mr-2' />
          <div className='text-alert-red'>{'Not available for registration'}</div>
        </div>
        <div className='mt-4'>
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
        {this.renderOwnershipDetails()}
      </div>
    )
  }

  renderBody() {
    if (this.props.isLoading || !this.props.domain) return null

    const statuses = this.props.domain.constants.DOMAIN_STATUSES

    switch (this.props.domain.status) {
      case statuses.AVAILABLE:
        return this.renderAvailableBody()

      case statuses.AUCTION_AVAILABLE:
        return this.renderAuctionAvailableBody()

      case statuses.AUCTION_BIDDING_CLOSED:
        return this.renderAuctionBiddingClosedBody()

      case statuses.REGISTERED_OTHER:
        return this.renderRegisteredOtherBody()

      case statuses.REGISTERED_SELF:
        return this.renderRegisteredSelfBody()
      
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{this.state.domain}</div>
        {this.renderBody()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: selectors.isLoading(state),
  domain: selectors.domain(state),
})

const mapDispatchToProps = (dispatch) => ({
  loadDomain: (domain) => dispatch(actions.loadDomain(domain)),
  addToCart: (domain) => dispatch(services.cart.actions.addToCart(domain)),
})

const component = connect(mapStateToProps, mapDispatchToProps)(Domain)

component.redux = {
  actions,
  constants,
  reducer,
  selectors,
}

export default component
