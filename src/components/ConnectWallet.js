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

  render() {
    return (
      <>
        {this.state.connecting ? (
          <div>
            <div className='my-8'>
              <components.labels.Information text={'Connecting to wallet'} />
            </div>
            <div className='max-w-sm m-auto'>
              <components.Button type='sm' text='Cancel connection' onClick={this.reset.bind(this)} />
            </div>
          </div>
        ) : (
          <div className='relative'>
            <div className={`max-w-xs m-auto ${this.state.connecting ? 'blur' : ''}`}>
              <div className='cursor-pointer' onClick={this.connectMetamask.bind(this)}>
                <img src={services.linking.static('images/vendor/metamask.svg')} alt="Metamask" />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}

export default ConnectWallet
