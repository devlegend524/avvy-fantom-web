import React from 'react'
import { connect } from 'react-redux'
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/solid'
import { CalendarIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'

import services from 'services'
import actions from './actions'
import constants from './constants'
import reducer from './reducer'
import selectors from './selectors'

import MyBids from './MyBids'


class AuctionPhase extends React.PureComponent {
  render() {
    const active = Date.now() >= this.props.startsAt && Date.now() < this.props.endsAt
    const past = Date.now() >= this.props.endsAt
    return (
      <div className={`flex rounded-xl border-2 ${active ? 'border-grayish-300 bg-grayish-300' : 'bg-gray-300 border-gray-300'} overflow-hidden`}>
        <div className={`${active ? 'bg-grayish-300' : 'bg-gray-300'} w-16 flex-shrink-0 flex items-center justify-center`}>
          {active ? (
            <ArrowRightIcon className='h-8 text-white' />
          ) : past ? (
            <CheckIcon className='h-8 text-white' />
          ) : (
            <CalendarIcon className='h-8 text-white' />
          )}
        </div>
        <div className='bg-white p-4 w-full'> 
          <div className='font-bold'>{this.props.name}</div>
          <div className='text-sm'>
            {new Intl.DateTimeFormat(
              navigator.language,
              { month: 'short', day: 'numeric', year: 'numeric' }
            ).format(this.props.startsAt)}
            {' at '}
            {new Intl.DateTimeFormat(
              navigator.langauge,
              { hour: 'numeric', minute: 'numeric' }
            ).format(this.props.startsAt)}
            </div>
        </div>
      </div>
    )
  }
}


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
    console.log(Date.now() / 1000, this.props.auctionPhases)
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
