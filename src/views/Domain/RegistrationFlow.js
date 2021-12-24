import React from 'react'

import components from 'components'
import services from 'services'


class RegistrationFlow extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  onConnect() {
    this.forceUpdate()
  }

  componentDidMount() {
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  componentWillUnmount() {
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  render() {
    return (
      <div>
        {!services.provider.isConnected() ? (
          <components.ConnectWallet />
        ) : null}
      </div>
    )
  }
}

export default RegistrationFlow
