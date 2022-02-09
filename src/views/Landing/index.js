import React from 'react'
import { connect } from 'react-redux'
import { ArrowRightIcon } from '@heroicons/react/solid'
import { Link } from 'react-router-dom'

import services from 'services'


class Landing extends React.PureComponent {
  render() {
    return (
      <div className='max-w-md m-auto'>
        <div className='font-bold text-center mt-4 text-lg'>{'Avvy Domains'}</div>
        <div className='text-center max-w-sm m-auto mt-4 mb-8'>{'A naming service designed to support the Avalanche ecosystem and its various subnets.'}</div>
        <Link
          to={services.linking.path('SunriseAuction')}
          className="flex justify-between bg-gray-100 font-bold p-4 rounded mb-2">
          <div>{'Sunrise Auction'}</div>
          <ArrowRightIcon className="h-6" />
        </Link>
        <Link
          to={services.linking.path('MyDomains')}
          className="flex justify-between bg-gray-100 font-bold p-4 rounded mb-2">
          <div>{'View my Domains'}</div>
          <ArrowRightIcon className="h-6" />
        </Link>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
