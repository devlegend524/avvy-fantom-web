import React from 'react'
import { connect } from 'react-redux'

import services from 'services'
import components from 'components'

import actions from './actions'
import selectors from './selectors'
import CreateAccount from './CreateAccount'
import Login from './Login'
import ResetPassword from './ResetPassword'
import VerifyWallet from './VerifyWallet'


const LOGIN_STATES = {
  LOGIN: 0,
  RESET_PASSWORD: 1,
  CREATE_ACCOUNT: 2,
}

class ConnectAccount extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { 
      loginState: LOGIN_STATES.LOGIN,
    }
  }

  componentDidMount() {
    this.props.checkHasAccount()
    this.props.reset()
  }

  setResetPassword = () => {
    this.props.reset()
    this.setState({ loginState: LOGIN_STATES.RESET_PASSWORD })
  }

  setCreateAccount = () => {
    this.props.reset()
    this.setState({ loginState: LOGIN_STATES.CREATE_ACCOUNT })
  }

  setLogin = () => {
    this.props.reset()
    this.setState({ loginState: LOGIN_STATES.LOGIN })
  }

  renderAccountSignature() {
    return <VerifyWallet />
  }

  renderNeedToken() {
    let Component = {
      [LOGIN_STATES.LOGIN]: Login,
      [LOGIN_STATES.RESET_PASSWORD]: ResetPassword,
      [LOGIN_STATES.CREATE_ACCOUNT]: CreateAccount,
    }[this.state.loginState]

    return (
      <>
        <Component />
        <div className='my-4 flex text-sm justify-center'>
          {this.state.loginState === LOGIN_STATES.LOGIN ? (
            <>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setCreateAccount}>Create an account</div>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setResetPassword}>Reset your password</div>
            </>
          ) : null}
          {this.state.loginState === LOGIN_STATES.RESET_PASSWORD ? (
            <>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setLogin}>Login</div>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setCreateAccount}>Create an account</div>
            </>
          ) : null}
          {this.state.loginState === LOGIN_STATES.CREATE_ACCOUNT ? (
            <>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setLogin}>Login</div>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setResetPassword}>Reset your password</div>
            </>
          ) : null}
        </div>
      </>
    )
  }

  render() {
    // (login token)
    if (!this.props.token) return this.renderNeedToken()
    if (!this.props.accountSignature) return this.renderAccountSignature()
    return (
      <>
          <>
            <div className='mb-4'>
              <components.labels.Information text={'To register a name with this wallet, you must verify the wallet address with an Avvy Account.'} />
            </div>
            <div className='relative max-w-sm m-auto mt-8'>
              <components.buttons.Button text='Connect Wallet to Account' onClick={() => window.location.href = services.linking.backend('ConnectAccount')} disabled={this.props.accountSignature} />
            </div>
            <div className='relative max-w-sm m-auto mt-4'>
              <components.buttons.Button text='Submit Verification' onClick={() => window.location.href = services.linking.backend('ConnectAccount')} />
            </div>
          </>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  hasAccount: selectors.hasAccount(state),
  accountSignature: selectors.accountSignature(state),
  token: services.user.selectors.token(state),
})

const mapDispatchToProps = (dispatch) => ({
  checkHasAccount: () => dispatch(actions.checkHasAccount()),
  reset: () => null,
})

export default connect(mapStateToProps, mapDispatchToProps)(ConnectAccount)
