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

  async connectMetamask(providerFunc) {
    const func = async () => {
      this.setState({
        connecting: true
      }, async () => {
        try {
          await services.provider.connectMetamask(providerFunc)
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
          <p>By checking the boxes below, you acknowledge that you have read and agree to our <a className='text-alert-blue' href="https://avvy.domains/p/privacy-policy" target="_blank">Privacy Policy</a> and our <a className='text-alert-blue' href="https://avvy.domains/p/terms-of-service" target="_blank">Terms of Service</a>.</p>
          <p className='mt-2'>You also acknowledge that <a className='text-alert-blue' target="_blank" href="https://avvy.domains/blog/name-squatting-dispute-resolution/">Avvy Domains supports name disputes</a>.</p>
        </div>
        <div className='mt-4'>
          <components.checkbox.Checkbox text={'I have read and agree to the Privacy Policy'} singleLine={true} checked={this.state.privacy} onCheck={() => this.toggleDisclaimer('privacy')} />
        </div>
        <div className='mt-2'>
          <components.checkbox.Checkbox text={'I have read and agree to the Terms of Service'} singleLine={true} checked={this.state.terms} onCheck={() => this.toggleDisclaimer('terms')} />
        </div>
        <div className='mt-2'>
          <components.checkbox.Checkbox text={'I understand that Avvy supports name disputes'} singleLine={true} checked={this.state.disputes} onCheck={() => this.toggleDisclaimer('disputes')} />
        </div>
        <div className='mt-4 max-w-sm m-auto'>
          <components.buttons.Button disabled={!this.state.terms || !this.state.privacy || !this.state.disputes} text={'Continue'} onClick={() => this.props.acceptDisclaimers()} />
        </div>
      </>
    )
  }

  render() {
    const wallets = [
      /*
      {
        name: 'Core',
        logo: services.linking.static('images/vendor/core.svg'),
        connect: () => {
          this.connectMetamask.bind(this)()
        },
        class: 'h-12 w-12',
      },
      */
      { 
        name: 'MetaMask',
        logo: services.linking.static('images/vendor/metamask.svg'),
        connect: () => {
          this.connectMetamask.bind(this)((provider) => provider.isMetaMask)
        },
        class: 'h-12 w-12',
      },
      {
        name: 'Coinbase Wallet', 
        logo: services.linking.static('images/vendor/coinbase.png'),
        connect: () => {
          this.connectMetamask.bind(this)((provider) => provider.isCoinbaseWallet)
        },
        class: 'h-12 w-12',
      },
      {
        name: 'WalletConnect',
        logo: services.linking.static('images/vendor/walletconnect.svg'),
        connect: this.walletConnect.bind(this),
        class: 'h-12 w-12',
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
                <div className={`${wal.class} flex items-center justify-center`}>
                  <img src={wal.logo} alt={wal.name} className='w-full' />
                </div>
                <div className='mt-2'>
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
