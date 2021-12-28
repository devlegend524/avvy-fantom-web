import React from 'react'
import { connect } from 'react-redux'
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/solid'

import services from 'services'
import components from 'components'

import actions from './actions'
import constants from './constants'
import reducer from './reducer'
import selectors from './selectors'

import RegistrationFlow from './RegistrationFlow'

class Register extends React.PureComponent {
  constructor(props) {
    super(props)
    const params = services.linking.getParams('Domain')
    this.state = {
      domain: params.domain,
    }
  }

  updateParams = () => {
    const params = services.linking.getParams('Domain')
    this.setState({
      domain: params.domain
    })
  }

  componentDidMount() {
    services.linking.addEventListener('Domain', this.updateParams)
    setTimeout(() => {
      this.props.refreshNameData()
    }, 1)
  }

  componentWillUnmount() {
    services.linking.removeEventListener('Domain', this.updateParams)
  }

  incrementQuantity(name) {
    this.props.incrementQuantity(name)
  }

  decrementQuantity(name) {
    this.props.decrementQuantity(name)
  }

  removeFromCart(name) {
    this.props.removeFromCart(name)
  }

  startPurchase() {
    this.registrationModal.toggle()
  }

  renderNameData(name) {
    const nameData = this.props.nameData[name]
    if (!nameData) return null
    return (
      <div className='text-gray-400 font-bold text-sm'>{services.money.renderUSD(nameData.priceUSDCents)} / year</div>
    )
  }

  renderQuantity(name) {
    const nameData = this.props.nameData[name]
    if (!nameData) return null
    const quantity = this.props.quantities[name]
    const itemTotal = services.money.mul(quantity, nameData.priceUSDCents)
    return (
      <div className='max-w-sm'>
        <div className='flex items-center'>
          <div className='p-4 cursor-pointer' onClick={() => this.decrementQuantity(name)}>
            <MinusCircleIcon className='w-8 text-gray-800' />
          </div>
          <div className='text-center text-sm'>
            <div className='font-bold'>{quantity} {quantity === '1' ? 'year' : 'years'}</div>
            <div className=''>{services.money.renderUSD(itemTotal)}</div>
          </div>
          <div className='p-4 cursor-pointer' onClick={() => this.incrementQuantity(name)}>
            <PlusCircleIcon className='w-8 text-gray-800' />
          </div>
        </div>
        <div className='cursor-pointer text-gray-400 mt-4 text-xs text-center sm:mt-2' onClick={() => this.removeFromCart(name)}>
          Remove
        </div>
      </div>
    )
  }

  renderName(name, index) {
    return (
      <div key={index} className='bg-gray-100 rounded-lg mb-4 p-4'>
        <div className='flex justify-between flex-col items-center sm:flex-row'>
          <div className='text-center sm:text-left'>
            <div className='font-bold sm:text-xl'>{name}</div>
            {this.renderNameData(name)}
          </div>
          {this.renderQuantity(name)}
        </div>
      </div>
    )
  }

  renderNames() {
    if (!this.props.names || this.props.names.length === 0) return (
      <div className='max-w-md m-auto'>
        <div className='mb-8'>
          <components.labels.Information text={"You haven't selected any names to register"} />
        </div>
        <components.DomainSearch />
      </div>
    )
    const names = Array.from(this.props.names).sort((a, b) => a > b ? 1 : -1)
    const nameData = this.props.nameData
    const quantities = this.props.quantities
    for (let i = 0; i < names.length; i += 1) {
      if (!nameData[names[i]] || !quantities[names[i]]) return null
    }
    const total = names.reduce((sum, curr) => {
      const namePrice = nameData[curr].priceUSDCents
      const namePriceAvax = nameData[curr].priceAVAXEstimate
      if (!namePrice || !namePriceAvax) return {
        usd: '0',
        avax: '0'
      }
      const quantity = quantities[curr]
      const registrationPrice = services.money.mul(namePrice, quantity)
      const registrationPriceAvax = services.money.mul(namePriceAvax, quantity)
      return {
        usd: services.money.add(sum.usd, registrationPrice),
        avax: services.money.add(sum.avax, registrationPriceAvax),
      }
    }, {usd: '0', avax: '0'})
    return (
      <>
        {names.map(this.renderName.bind(this))}
        <div className='max-w-md m-auto mt-8'>
          <div className='m-auto mb-8 max-w-xs'>
            <div className='border-b border-gray-400 pb-4 mb-4'>
              <div className='text-lg text-center font-bold'>{'Purchase Summary'}</div>
              <div className='text-md text-center text-gray-500'>{'(Estimated)'}</div>
            </div>
            <div className='flex justify-between'>
              <div className='font-bold'>
                {"Total"}
              </div>
              <div className=''>
                {services.money.renderUSD(total.usd)}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='font-bold'>
                {"Total (AVAX)"}
              </div>
              <div className=''>
                {services.money.renderAVAX(total.avax)}
              </div>
            </div>
          </div>
          <div className='my-8'>
            <components.labels.Information text={'Registrations are priced in USD, but payable in AVAX. Amounts noted are estimates; actual price will be determined in future steps.'} />
          </div>
          <components.Button text={'Continue Registration'} onClick={this.startPurchase.bind(this)} />
        </div>
      </>
    )
  }

  render() {
    return (
      <div>
        <components.Modal ref={(ref) => this.registrationModal = ref}> 
          <RegistrationFlow />
        </components.Modal>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{'Register'}</div>
        {this.renderNames()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  names: services.cart.selectors.names(state),
  nameData: services.cart.selectors.nameData(state),
  quantities: services.cart.selectors.quantities(state),
})

const mapDispatchToProps = (dispatch) => ({
  removeFromCart: (name) => dispatch(services.cart.actions.removeFromCart(name)),
  incrementQuantity: (name) => dispatch(services.cart.actions.incrementQuantity(name)),
  decrementQuantity: (name) => dispatch(services.cart.actions.decrementQuantity(name)),
  refreshNameData: () => dispatch(services.cart.actions.refreshAllNameData()),
})

const component = connect(mapStateToProps, mapDispatchToProps)(Register)

component.redux = {
  actions,
  constants,
  reducer,
  selectors,
}

export default component
