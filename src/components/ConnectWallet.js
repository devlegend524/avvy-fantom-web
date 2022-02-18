import React from 'react'
import services from 'services'
import components from 'components'


class ConnectWallet extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { 
      connecting: false,
    }
  }

  reset() {
    this.setState({
      connecting: false
    })
  }

  async connectMetamask() {
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

  render() {
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
          <div className='relative'>
            <div onClick={this.walletConnect.bind(this)} className={`cursor-pointer max-w-xs h-24 flex items-center justify-center p-8 border border-gray-300 rounded-xl m-auto ${this.state.connecting ? 'blur' : ''}`}>
              <div>
                <img src={services.linking.static('images/vendor/walletconnect.svg')} className='h-20' />
              </div>
            </div>
            <div onClick={this.connectMetamask.bind(this)} className={`cursor-pointer max-w-xs h-24 mt-4 flex items-center justify-center border border-gray-300 rounded-xl m-auto ${this.state.connecting ? 'blur' : ''}`}>
              <div>
                <img src={services.linking.static('images/vendor/metamask.svg')} alt="Metamask" className='h-20' />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}

export default ConnectWallet
