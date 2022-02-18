import React from 'react'
import { CheckIcon } from '@heroicons/react/solid'


class Checkbox extends React.PureComponent {
  check = () => {
    if (this.props.onCheck) {
      this.props.onCheck()
    }
  }

  render() {
    return (
      <div className='flex items-flex-start cursor-pointer' onClick={this.check}>
        <div className='mr-4 mt-2 w-6 h-6 border-2 border-gray-700 rounded flex-shrink-0 flex items-center justify-center'>
          {this.props.checked ? (
            <CheckIcon className='w-6 text-gray-700' />
          ) : null}
        </div>
        <div className='text-gray-700'>
          {this.props.text}
        </div>
      </div>
    )
  }
}

export default Checkbox
