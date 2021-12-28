import React from 'react'
import { connect } from 'react-redux'

import components from 'components'
import services from 'services'


class RegistrationFlow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      connected: services.provider.isConnected()
    }
  }

  onConnect() {
    this.setState({
      connected: services.provider.isConnected()
    })
  }

  componentDidMount() {
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  componentWillUnmount() {
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  renderConnect() {
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Connect Wallet'}</div>
        <components.ConnectWallet />
      </>
    )
  }

  render() {
    if (!this.state.connected) return this.renderConnect()
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Generate Proofs'}</div>
        <div className=''>
          <div className='font-bold'>Name</div>
        </div>
        <div className='mt-4'>
          <div className='font-bold'>Annual registration fee</div>
        </div>
        <div className='mt-4'>
          <div className='font-bold'>Total</div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  names: services.cart.selectors.names(state),
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationFlow)
