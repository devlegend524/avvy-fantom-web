import React from 'react'
import { connect } from 'react-redux'
import { ArrowRightIcon } from '@heroicons/react/solid'


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
        <div className='mb-4 ml-4'>{"My Domains"}</div>
        {this.domains.map((domain) => (
          <div className="flex justify-between bg-gray-100 font-bold p-4 rounded mb-2">
            <div>{domain}</div>
						<ArrowRightIcon className="h-6" />
          </div>
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = (dispatch) => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(MyDomains)
