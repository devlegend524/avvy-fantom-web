import React from 'react'
import { connect } from 'react-redux'

import components from 'components'
import services from 'services'

import actions from './actions'
import selectors from './selectors'


class RegistrationFlow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      connected: services.provider.isConnected(),
      needsProofs: true
    }
  }

  generateProofs() {
    this.setState({
      needsProofs: false
    }, () => {
      this.props.generateProofs(this.props.names)
    })
  }

  onConnect() {
    setTimeout(() => {
      this.setState({
        connected: services.provider.isConnected(),
        needsProofs: true
      })
    }, 1)
  }

  componentDidMount() {
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  componentWillUnmount() {
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.names.length !== prevProps.names.length) {
      this.setState({
        needsProofs: true
      })
    }
  }

  renderConnect() {
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Connect Wallet'}</div>
        <components.ConnectWallet />
      </>)
  }

  render() {
    if (!this.state.connected) return this.renderConnect()
    const names = this.props.names
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Generate Proofs'}</div>
        <components.labels.Information text={"We want to know certain things about your domain name, but we want to respect your privacy. To achieve both, we use a tool called a zero-knowledge proof. Generating these proofs requires a lot of computational power, so your browser might be slow or even freeze temporarily. Just sit tight, we'll let you know when it's done. Please do not refresh or exit the page."} />
        <div className='mt-4 max-w-sm m-auto'>
          {this.state.needsProofs ? (
            <>
              <components.Button text={'Generate proofs'} onClick={this.generateProofs.bind(this)} />
            </>
          ) : (
            <>
              <div className='border border-gray-100 p-2 rounded'>
                <div className='mb-4 text-center text-xs text-gray-400'>{this.props.progress.message}</div>
                <components.ProgressBar progress={this.props.progress.percent} />
              </div>
              {this.props.progress.percent === 100 ? (
                <div className='mt-4'>
                  <components.Button text={'Complete registration'} />
                </div>
              ) : null}
            </>
          )}
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  names: services.cart.selectors.names(state),
  progress: selectors.progress(state),
})

const mapDispatchToProps = (dispatch) => ({
  generateProofs: (names) => dispatch(actions.generateProofs(names)),
  resetProofs: () => dispatch(actions.resetProofs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationFlow)
