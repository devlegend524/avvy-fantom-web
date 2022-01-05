import React from 'react'
import { connect } from 'react-redux'

import components from 'components'
import services from 'services'

import actions from './actions'
import selectors from './selectors'


class RevealFlow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      connected: services.provider.isConnected(),
    }
  }

  onConnect() {
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

  renderConnect() {
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Connect Wallet'}</div>
        <components.ConnectWallet />
      </>
    )
  }

  renderReveal() {
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Generate Proofs'}</div>
        <components.labels.Information text={"Generating zero-knowledge proofs might cause your browser to slow down or even freeze temporarily. Just sit tight, we'll let you know when it's done. Please do not refresh or exit the page."} />
        {this.state.needsProofs ? (
          <div className='mt-8 max-w-sm m-auto'>
            <components.buttons.Button text={'Generate proofs'} onClick={this.generateProofs.bind(this)} />
          </div>
        ) : (
          <>
            <div className='my-8 py-4 rounded'>
              <div className='mb-4 text-center text-gray-400 flex items-center justify-center'>
                {this.props.progress.message}
              </div>
              <div className='max-w-sm m-auto'>
                <components.ProgressBar progress={this.props.progress.percent} />
              </div>
            </div>
            <div className='mt-4 max-w-sm m-auto'>
              <components.buttons.Button text={'Continue'} onClick={() => this.setState({ hasProofs: true })} disabled={this.props.progress.percent < 100} />
            </div>
          </>
        )}
      </>
    )
  }

  renderComplete() {
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Bid submission complete'}</div>
        <components.labels.Success text={"Your sealed bids were successfully submitted. DO NOT forget that there are more steps to complete. Failure to complete additional steps will result in your bids being disqualified."} />
        <div className='mt-8 max-w-sm m-auto'>
          <div className='mt-4'>
            <components.buttons.Button text={'View my bids'} onClick={(navigate) => {
              this.props.onComplete()
              services.linking.navigate(navigate, 'SunriseAuctionMyBids')
            }} />
          </div>
        </div>
      </>
    )
  }

  renderHasError() {
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Error'}</div>
        <components.labels.Error text={"We've encountered an error with your registration. Please reload the page and try again."} />
        <div className='mt-8 max-w-sm m-auto'>
          <components.buttons.Button text={'Reload page'} onClick={() => window.location.reload()} />

        </div>
      </>
    )
  }

  render() {
    if (this.props.hasError) return this.renderHasError()
    if (!this.state.connected) return this.renderConnect()
    return this.renderComplete()
  }
}

const mapStateToProps = (state) => ({
  names: services.sunrise.selectors.names(state),
  bundles: services.sunrise.selectors.bundles(state),
  bidBundles: services.sunrise.selectors.bidBundles(state),
})

const mapDispatchToProps = (dispatch) => ({
  generateProofs: (names) => dispatch(actions.generateProofs(names)),
  submitBid: () => dispatch(actions.submitBid()),
})


export default connect(mapStateToProps, mapDispatchToProps)(RevealFlow)
