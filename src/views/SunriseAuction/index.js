import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/solid'

import services from 'services'
import actions from './actions'
import constants from './constants'
import reducer from './reducer'
import selectors from './selectors'

import AuctionPhase from './AuctionPhase'
import MyBids from './MyBids'




class SunriseAuction extends React.PureComponent {
  componentDidMount() {
    this.props.loadAuctionPhases()
  }

  renderAuctionPhases() {
    if (!this.props.auctionPhases) return null
    const bidPlacementStartsAt = this.props.auctionPhases[0] * 1000
    const bidRevealStartsAt = this.props.auctionPhases[1] * 1000
    const claimStartsAt = this.props.auctionPhases[2] * 1000
    const claimEndsAt = this.props.auctionPhases[3] * 1000
    const end = new Date((claimEndsAt + 60 * 60 * 24 * 365 * 100) * 1000)
    return (
      <div className='mt-4 bg-gray-100 rounded-lg p-4'>
        <div className='font-bold mb-4'>{'Auction Phases'}</div>
        <div className='underline mb-8 text-sm text-gray-700'>{'Read more about the Sunrise Auction here'}</div>
        <div className='mt-2'>
          <AuctionPhase name='Bid placement' startsAt={bidPlacementStartsAt} endsAt={bidRevealStartsAt} />
        </div>
        <div className='mt-2'>
          <AuctionPhase name='Bid reveal' startsAt={bidRevealStartsAt} endsAt={claimStartsAt} />
        </div>
        <div className='mt-2'>
          <AuctionPhase name='Domain claiming' startsAt={claimStartsAt} endsAt={claimEndsAt} />
        </div>
        <div className='mt-2'>
          <AuctionPhase name='Auction over' startsAt={claimEndsAt} endsAt={end} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className='font-bold text-center mt-4 text-lg'>{'Sunrise Auction'}</div>
        <div className='max-w-sm m-auto mt-4'>{'Welcome to the sunrise auction. During the auction, you may select & bid on the domains you wish to acquire. You can update your bids at any time during the bid placement phase.'}</div>
        <div className='mt-8'>
          <Link to={services.linking.path('SunriseAuctionMyBids')}>
            <div className='cursor-pointer flex items-center justify-between bg-gray-100 rounded-lg p-4 font-bold'>
              <div>{'My Bids'}</div>
              <ArrowRightIcon className="h-6" />
            </div>
          </Link>
        </div>
        {this.renderAuctionPhases()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auctionPhases: selectors.auctionPhases(state),
})

const mapDispatchToProps = (dispatch) => ({
  loadAuctionPhases: () => dispatch(actions.loadAuctionPhases()),
})

const component = connect(mapStateToProps, mapDispatchToProps)(SunriseAuction)

component.redux = {
  actions,
  constants,
  reducer,
  selectors,
}

component.MyBids = MyBids

export default component
