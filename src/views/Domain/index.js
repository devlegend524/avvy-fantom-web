import React from 'react'
import { connect } from 'react-redux'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { InformationCircleIcon } from '@heroicons/react/outline'

import linkingService from 'services/linking'
import components from 'components'

const NAME_STATUSES = {
  CAN_REGISTER: 1,
  CAN_BID: 2,
  BIDDING_CLOSED: 3,
  UNAVAILABLE: 4,
}


class Domain extends React.PureComponent {
  constructor(props) {
    super(props)
    const params = linkingService.getParams('Domain')
    this.state = {
      domain: params.domain,
      //nameStatus: NAME_STATUSES.CAN_REGISTER,
      //nameStatus: NAME_STATUSES.CAN_BID
      //nameStatus: NAME_STATUSES.BIDDING_CLOSED,
      nameStatus: NAME_STATUSES.UNAVAILABLE,
    }
    this.searchPlaceholder = 'Search for another name'
  }

  updateParams = () => {
    const params = linkingService.getParams('Domain')
    this.setState({
      domain: params.domain
    })
  }

  componentDidMount() {
    linkingService.addEventListener('Domain', this.updateParams)
  }

  componentWillUnmount() {
    linkingService.removeEventListener('Domain', this.updateParams)
  }

  renderCanRegisterBody() {
    return (
      <div className='max-w-md m-auto'>
        <div className='max-w-sm m-auto mt-4 flex items-center justify-center'>
          <CheckCircleIcon className='w-6 text-alert-blue mr-2' />
          <div className='text-alert-blue'>{'Available for registration'}</div>
        </div>
        <div className='mt-8'>
          <components.Button text={'Register this name'} />
        </div>
        <div className='mt-4'>
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
      </div>
    )
  }

  renderCanBidBody() {
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

  renderBiddingClosedBody() {
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

  renderUnavailableBody() {
    return (
      <div className='max-w-md m-auto'>
        <div className='max-w-sm m-auto mt-4 flex items-center justify-center'>
          <InformationCircleIcon className='w-6 text-alert-red mr-2' />
          <div className='text-alert-red'>{'Not available for registration'}</div>
        </div>
        <div className='mt-4'>
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
        <div className='mt-4 bg-gray-100 rounded-xl w-full relative p-8'>
          <div>
            <div className='font-bold'>{'Registrant'}</div>
            <div>
              {'0x9d7b2CF7daD4A5FA54E3d4CC3A6'}
            </div>
          </div>
          <div className='mt-4'>
            <div className='font-bold'>{'Expiry'}</div>
            <div>
              {'Jan 10, 2021 at 10:31pm'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBody() {
    switch (this.state.nameStatus) {
      case NAME_STATUSES.CAN_REGISTER:
        return this.renderCanRegisterBody()

      case NAME_STATUSES.CAN_BID:
        return this.renderCanBidBody()

      case NAME_STATUSES.BIDDING_CLOSED:
        return this.renderBiddingClosedBody()

      case NAME_STATUSES.UNAVAILABLE:
        return this.renderUnavailableBody()
      
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
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Domain)
