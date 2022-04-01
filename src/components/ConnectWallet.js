import React from 'react'
import { connect } from 'react-redux'

import services from 'services'
import components from 'components'


class ConnectWallet extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { 
      connecting: false,
      privacy: false,
      terms: false,
    }
  }

  reset() {
    this.setState({
      connecting: false
    })
  }

  async connectMetamask() {
    const func = async () => {
      this.setState({
        connecting: true
      }, async () => {
        try {
          await services.provider.connectMetamask()
        } catch (err) {
          alert('Failed to connect')
          this.setState({
            connecting: false
          })
        }
      })
    }
    if (services.device.isAndroid()) {
      alert('Metamask Mobile on Android will randomly fail to connect. In general, we recommend using a computer to access Avvy, and connecting to Metamask Mobile via WalletConnect.')
      await func()
    } else {
      await func()
    }
  }

  async walletConnect() {
    this.setState({
      connecting: true
    }, async () => {
      try {
        await services.provider.connectWalletConnect()
      } catch (err) {
        if (err === 'WRONG_CHAIN') {
          alert(`Wrong EVM chain. Please connect to ${services.environment.DEFAULT_CHAIN_NAME}.`)
        } else {
          alert('Failed to connect')
        }
        this.setState({
          connecting: false
        })
      }
    })
  }

  toggleDisclaimer = (stateKey) => {
    this.setState((currState) => {
      return {
        [stateKey]: !currState[stateKey]
      }
    })
  }

  renderDisclaimers() {
    return (
      <>
        <div className=''>
          By checking the boxes below, you acknowledge that you have read and agree to our <a className='text-alert-blue' href="https://avvy.domains/p/privacy-policy" target="_blank">Privacy Policy</a> and our <a className='text-alert-blue' href="https://avvy.domains/p/terms-of-service" target="_blank">Terms of Service</a>
        </div>
        <div className='mt-4'>
          <components.checkbox.Checkbox text={'Privacy Policy'} singleLine={true} checked={this.state.privacy} onCheck={() => this.toggleDisclaimer('privacy')} />
        </div>
        <div className='mt-2'>
          <components.checkbox.Checkbox text={'Terms of Service'} singleLine={true} checked={this.state.terms} onCheck={() => this.toggleDisclaimer('terms')} />
        </div>
        <div className='mt-4 max-w-sm m-auto'>
          <components.buttons.Button disabled={!this.state.terms || !this.state.privacy} text={'Continue'} onClick={() => this.props.acceptDisclaimers()} />
        </div>
      </>
    )
  }

  render() {
    const wallets = [
      { 
        name: 'MetaMask',
        logo: services.linking.static('images/vendor/metamask.svg'),
        connect: this.connectMetamask.bind(this)
      },
      {
        name: 'WalletConnect',
        logo: services.linking.static('images/vendor/walletconnect.svg'),
        connect: this.walletConnect.bind(this)
      }
    ]
    if (!this.props.hasAcceptedDisclaimers) return this.renderDisclaimers()

    return (
      <>
        {this.state.connecting ? (
          <div>
            <div className='my-8'>
              <components.labels.Information text={'Connecting to wallet'} />
            </div>
            <div className='max-w-sm m-auto'>
              <components.buttons.Button type='sm' text='Cancel connection' onClick={this.reset.bind(this)} />
            </div>
          </div>
        ) : (
          <div className='relative grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
            {wallets.map((wal, index) => (
              <div key={index} onClick={wal.connect} className={`cursor-pointer flex flex-col items-center justify-center rounded-xl m-auto bg-gray-100 dark:bg-gray-800 w-full h-32 ${this.state.connecting ? 'blur' : ''}`}>
                <div className='w-12 h-12 flex items-center justify-center'>
                  <img src={wal.logo} alt={wal.name} className='w-full' />
                </div>
                <div>
                  {wal.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  injectSentry: services.user.selectors.injectSentry(state),
  hasAcceptedDisclaimers: services.user.selectors.hasAcceptedDisclaimers(state),
})

const mapDispatchToProps = (dispatch) => ({
  acceptDisclaimers: () => dispatch(services.user.actions.acceptDisclaimers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConnectWallet)
