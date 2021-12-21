import React from 'react'
import { connect } from 'react-redux'
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/solid'
import { CalendarIcon } from '@heroicons/react/outline'


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
  render() {
    const now = parseInt(Date.now() / 1000)
    const bidPlacementStartsAt = new Date((now - 120) * 1000)
    const bidRevealStartsAt = new Date((now - 120) * 1000)
    const claimStartsAt = new Date((now + 120) * 1000)
    const claimEndsAt = new Date((now + 180) * 1000)
    const end = new Date((now + 60 * 60 * 24 * 365 * 100) * 1000)
    return (
      <div>
        <div className='font-bold text-center mt-4 text-lg'>{'Sunrise Auction'}</div>
        <div className='max-w-sm m-auto mt-4'>{'Welcome to the sunrise auction. During the auction, you may select & bid on the domains you wish to acquire. You can update your bids at any time during the bid placement phase.'}</div>
        <div className='mt-8'>
          <div className='cursor-pointer flex items-center justify-between bg-gray-100 rounded-lg p-4 font-bold'>
            <div>{'My Bids'}</div>
						<ArrowRightIcon className="h-6" />
          </div>
        </div>
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
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SunriseAuction)
