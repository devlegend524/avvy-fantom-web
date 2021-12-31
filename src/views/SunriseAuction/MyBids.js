import React from 'react'
import { connect } from 'react-redux'
import { ethers } from 'ethers'
import { TrashIcon } from '@heroicons/react/solid'

import components from 'components'
import services from 'services'


class MyBids extends React.PureComponent {
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

  render() {
    const bids = this.props.bids
    const keys = Object.keys(bids).sort()
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
      <>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{'My Bids'}</div>
        <div className='mb-8'>
          <components.labels.Information text={'Some of your bids are not submitted.'} />
        </div>
        {keys.map((key, index) => {
          return (
            <div className='bg-gray-100 rounded-lg p-4 mb-4' key={index}>
              <div className='font-bold'>{key}</div>
              <div className=''>Your Bid: {services.money.renderAVAX(bids[key])}</div>
              <div className=''>Yearly registration fee: {services.money.renderUSD(nameData[key].priceUSDCents)}</div>
              <div className='flex mt-2'>
                <div className='flex items-end cursor-pointer' onClick={() => this.props.deleteBid(key)}>
                  <TrashIcon className='w-4' />
                  <div className='font-bold text-xs ml-1'>{"Delete"}</div>
                </div>
              </div>
            </div>
          )
        })}
        <div className='max-w-md m-auto mt-8'>
          <div className='m-auto mb-8 max-w-xs'>
            <div className='border-b border-gray-400 pb-4 mb-4'>
              <div className='text-lg text-center font-bold'>{'Summary'}</div>
              <div className='text-md text-center text-gray-500'>{'(Totals if all auctions are won)'}</div>
            </div>
            <div className='flex justify-between'>
              <div className='font-bold'>
                {'Auction Bids'}
              </div>
              <div className=''>
                {services.money.renderAVAX(bidTotal)}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='font-bold'>
                {"Registration Fees"}
              </div>
              <div className=''>
                {services.money.renderUSD(registrationTotal)} /year
              </div>
            </div>
          </div>
          <div className='my-8'>
            <components.labels.Information text={'Please ensure that you have enough to cover bids & registration fees if you win every auction. All amounts will be payable in WAVAX. Final amounts will be calculated based on USD-AVAX exchange rate when auctions are settled.'} />
          </div>
          <components.buttons.Button text={'Place Bids'} />
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  bids: services.sunrise.selectors.bids(state),
  nameData: services.sunrise.selectors.nameData(state),
})

const mapDispatchToProps = (dispatch) => ({
  deleteBid: (key) => dispatch(services.sunrise.actions.deleteBid(key)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyBids)
