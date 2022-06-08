import React from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

import components from 'components'
import services from 'services'


class AddRecord extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      recordType: null,
      value: '',
      options: props.api ? props.api.avvy.RECORDS._LIST.map(record => {
        return {
          value: record.key,
          name: record.label
        }
      }) : []
    }
  }

  handleSubmit = () => {
    let type = this.selectRef.getValue()
    let value = this.inputRef.value 
    this.props.handleSubmit(type, value)
  }

  render() {
    return (
      <>
        <div className='max-w-md m-auto'>
          <div className='font-bold mb-2'>
            Type
          </div>
          <components.Select value={this.state.recordType} options={this.state.options} ref={(ref) => this.selectRef = ref} />
          <div className='font-bold mt-4 mb-2'>
            Value
          </div>
          <input type='text' className='bg-gray-100 dark:bg-gray-800 w-full rounded-xl px-4 py-2' ref={(ref) => this.inputRef = ref} />
          <div className='mt-8'>
            <components.buttons.Button sm={true} text={'Submit'} onClick={this.handleSubmit} loading={this.props.loading} />
          </div>
        </div>
      </>
    )
  }
}

export default AddRecord
