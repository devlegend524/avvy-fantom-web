import React from 'react'
import { connect } from 'react-redux'

import services from 'services'
import components from 'components'

function ResetPasswordForm(props) {
  let email = React.createRef()
  
  const handleSubmit = (e) => {
    props.onSubmit(email.current.value)
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='pb-2 pl-2 text-gray-700 text-sm uppercase font-bold'>Email Address</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input autoComplete="off" disabled={props.result === true} ref={email} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        {props.result === true ? (
          <div className='my-4'>
            <components.labels.Success text={'We have attempted resetting the password for this email address. Please check your email.'} />
          </div>
        ) : props.result === false ? (
          <div className='my-4'>
            <components.labels.Error text={'Failed to reset password.'} />
          </div>
        ) : null}
        {props.result !== true ? (
          <div className='mt-4'>
            <components.buttons.Button text='Reset Password' onClick={() => handleSubmit()} loading={props.loading} />
          </div>
        ) : null}
      </form>
    </>
  )
}

function CreateAccountForm(props) {
  let name = React.createRef()
  let email = React.createRef()
  
  const handleSubmit = (e) => {
    props.onSubmit(name.current.value, email.current.value)
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='pb-2 pl-2 text-gray-700 text-sm uppercase font-bold'>Name</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input autoComplete="off" ref={name} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        <div className='pb-2 pl-2 center text-gray-700 text-sm uppercase mt-4 font-bold'>Email Address</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input type="password" autoComplete="off" ref={email} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        {props.error ? (
          <div className='my-4'>
            <components.labels.Error text={props.error} />
          </div>
        ) : null}
        <div className='mt-4'>
          <components.buttons.Button text='Create account' onClick={() => handleSubmit()} loading={props.loading} />
        </div>
      </form>
    </>
  )
}

function LoginForm(props) {
  let email = React.createRef()
  let password = React.createRef()
  
  const handleSubmit = (e) => {
    props.onSubmit(email.current.value, password.current.value)
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='pb-2 pl-2 text-gray-700 text-sm uppercase font-bold'>Email Address</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input autoComplete="off" ref={email} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        <div className='pb-2 pl-2 center text-gray-700 text-sm uppercase mt-4 font-bold'>Password</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input type="password" autoComplete="off" ref={password} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        {props.error ? (
          <div className='my-4'>
            <components.labels.Error text={props.error} />
          </div>
        ) : null}
        <div className='mt-4'>
          <components.buttons.Button text='Login' onClick={() => handleSubmit()} loading={props.loading} />
        </div>
      </form>
    </>
  )
}

const LOGIN_STATES = {
  LOGIN: 0,
  RESET_PASSWORD: 1,
  CREATE_ACCOUNT: 2,
}

class ConnectAccount extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { 
      isLoggingIn: false,
      isResettingPassword: false,
      loginState: LOGIN_STATES.LOGIN,
    }
  }

  componentDidMount() {
    this.props.checkHasAccount()
    this.props.reset()
  }
  
  handleLogin =  (email, password) => {
    this.props.login(email, password)
  }

  handleResetPassword = (email) => {
    this.props.resetPassword(email)
  }

  setResetPassword = () => {
    this.props.reset()
    this.setState({ loginState: LOGIN_STATES.RESET_PASSWORD })
  }

  renderLogin() {
    return (
      <>
        <div className='relative max-w-sm m-auto mt-8'>
          <div className='text-center pb-4 font-bold text-xl'>Login</div>
          <LoginForm onSubmit={this.handleLogin} loading={this.state.isLoggingIn} error={this.props.loginError} />
        </div>
        <div className='my-4 flex text-sm justify-center'>
          <div className='cursor-pointer px-2 text-gray-500' onClick={() => this.setState({ loginState: LOGIN_STATES.CREATE_ACCOUNT })}>Create an account</div>
          <div className='cursor-pointer px-2 text-gray-500' onClick={this.setResetPassword}>Reset your password</div>
        </div>
      </>
    )
  }

  renderResetPassword() {
    return (
      <>
        <div className='relative max-w-sm m-auto mt-8'>
          <div className='text-center pb-4 font-bold text-xl'>Reset Password</div>
          <ResetPasswordForm onSubmit={this.handleResetPassword} loading={this.props.resetPasswordLoading} result={this.props.resetPasswordResult} />
        </div>
        <div className='my-4 flex text-sm justify-center'>
          <div className='cursor-pointer px-2 text-gray-500' onClick={() => this.setState({ loginState: LOGIN_STATES.LOGIN })}>Login</div>
          <div className='cursor-pointer px-2 text-gray-500' onClick={() => this.setState({ loginState: LOGIN_STATES.CREATE_ACCOUNT })}>Create an account</div>
        </div>
      </>
    )
  }

  renderCreateAccount() {
    return (
      <>
        <div className='relative max-w-sm m-auto mt-8'>
          <div className='text-center pb-4 font-bold text-xl'>Create Account</div>
          <CreateAccountForm onSubmit={this.handleLogin} loading={this.state.isLoggingIn} error={this.props.loginError} />
        </div>
        <div className='my-4 flex text-sm justify-center'>
          <div className='cursor-pointer px-2 text-gray-500' onClick={() => this.setState({ loginState: LOGIN_STATES.LOGIN })}>Login</div>
          <div className='cursor-pointer px-2 text-gray-500' onClick={this.setResetPassword}>Reset your password</div>
        </div>
      </>
    )
  }

  renderAccountSignature() {
    return (
      <>
        <div className='max-w-md m-auto'>
          <div className='mb-4'>
            <components.labels.Information text={'Verify your wallet to continue with your registration.'} />
          </div>
          <components.buttons.Button text={'Verify my wallet'} onClick={() => this.props.verifyWallet()} loading={this.props.verifyWalletLoading} />
        </div>
      </>
    )
  }

  renderNeedToken() {
    switch (this.state.loginState) {
      case LOGIN_STATES.LOGIN:
        return this.renderLogin()

      case LOGIN_STATES.RESET_PASSWORD:
        return this.renderResetPassword()

      case LOGIN_STATES.CREATE_ACCOUNT:
        return this.renderCreateAccount()
    }
    return null
  }

  render() {
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
  hasAccount: services.user.selectors.hasAccount(state),
  accountSignature: services.user.selectors.accountSignature(state),
  token: services.user.selectors.token(state),
  loginError: services.user.selectors.loginError(state),
  resetPasswordResult: services.user.selectors.resetPasswordResult(state),
  resetPasswordLoading: services.user.selectors.resetPasswordLoading(state),
  verifyWalletLoading: services.user.selectors.verifyWalletLoading(state),
})

const mapDispatchToProps = (dispatch) => ({
  reset: () => {
    dispatch(services.user.actions.resetConnectAccount())
    dispatch(services.user.actions.resetVerifyWallet())
  },
  checkHasAccount: () => dispatch(services.user.actions.checkHasAccount()),
  login: (email, password) => dispatch(services.user.actions.login(email, password)),
  resetPassword: (email) => dispatch(services.user.actions.resetPassword(email)),
  verifyWallet: () => dispatch(services.user.actions.verifyWallet()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConnectAccount)
