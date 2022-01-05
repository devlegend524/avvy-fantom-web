import React from 'react'
import { connect } from 'react-redux'
import { ethers } from 'ethers'

import components from 'components'
import services from 'services'

import actions from './actions'
import selectors from './selectors'

class Summary extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      connected: services.provider.isConnected(),
    }
  }

  onConnect() {
    this.connect.hide()
    this.props.checkAvailableWAVAX()
    setTimeout(() => {
      this.setState({
        connected: services.provider.isConnected(),
      })
    }, 1)
  }

  componentDidMount() {
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  componentWillUnmount() {
    services.provider.removeEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  renderAvailableWavax() {
    if (!this.props.approvedWavax || !this.props.availableWavax || !this.props.bidTotal) return null
    const approved = ethers.BigNumber.from(this.props.approvedWavax)
    const available = ethers.BigNumber.from(this.props.availableWavax)
    const bidTotal = ethers.BigNumber.from(this.props.bidTotal)
    if (available.lt(bidTotal)) return (
      <div className='mt-4'>
        <components.labels.Error text={`You do not have enough WAVAX to cover your bids. You need to acquire ${services.money.renderWAVAX(bidTotal.toString())}. You can use a DEX of your choice to swap AVAX for WAVAX.`} />
        <div className='mt-4'>
          <components.buttons.Button text={'Refresh'} onClick={() => this.props.checkAvailableWAVAX()} />
        </div>
      </div>
    )
    if (available.gte(bidTotal)) return (
      <div className='mt-4'>
        <components.labels.Success text={'You have approved enough WAVAX to cover your bids'} />
      </div>
    )
    return (
      <div className='mt-4'>
        <components.labels.Error text={'You have not approved enough WAVAX to cover your bids'} />
        <div className='mt-4'>
          <components.buttons.Button text={'Approve WAVAX'} onClick={() => this.props.approveWavax(bidTotal.toString())} />
        </div>
      </div>
    )
  }

  render() {
    const bidTotal = this.props.bidTotal
    const registrationTotal = this.props.registrationTotal

    return (
      <>
        <components.Modal ref={(ref) => this.connect = ref} title='Connect Wallet'>
          <components.ConnectWallet />
        </components.Modal>
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
              {services.money.renderWAVAX(bidTotal)}
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
          {this.state.connected ? this.renderAvailableWavax() : (
            <div className='mt-4'>
              <components.labels.Error text={'Connect your wallet to see whether your bids are covered'} />
              <div className='mt-4'>
                <components.buttons.Button text={'Connect wallet'} onClick={() => this.connect.toggle()} />
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  availableWavax: selectors.availableWavax(state),
  approvedWavax: selectors.approvedWavax(state),
})

const mapDispatchToProps = (dispatch) => ({
  checkAvailableWAVAX: () => dispatch(actions.checkAvailableWAVAX()),
  approveWavax: (total) => dispatch(actions.approveWavax(total)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Summary)
