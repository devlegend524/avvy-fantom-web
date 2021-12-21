import React from 'react'
import { connect } from 'react-redux'
import { ArrowRightIcon } from '@heroicons/react/solid'
import { Link } from 'react-router-dom'

import linkingService from 'services/linking'


class MyDomains extends React.PureComponent {
  constructor(props) {
    super(props)
    this.domains = [
      'avvydomains.avax',
      'testname.avax',
    ]
  }

  render() {
    return ( 
      <div>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{"My Domains"}</div>
        <div className='max-w-sm m-auto mt-4'>{'These are the domains currently in your wallet. To manage your domains, click here.'}</div>
        <div className='mt-8'>
          {this.domains.map((domain, index) => (
            <Link
              key={index}
              to={linkingService.path('Domain', { domain })}
              className="flex justify-between bg-gray-100 font-bold p-4 rounded mb-2">
              <div>{domain}</div>
              <ArrowRightIcon className="h-6" />
            </Link>
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = (dispatch) => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(MyDomains)
