import React from 'react'


class Select extends React.PureComponent {
  getValue() {
    return this.selectRef.value
  }

  render() {
    return (
      <select className='bg-gray-100 dark:bg-gray-700 py-2 px-2 rounded-xl w-full' ref={(ref) => this.selectRef = ref}>
        {this.props.options.map((option, index) => {
          return (
            <option key={index} value={option.value}>{option.name}</option>
          )
        })}
      </select>
    )
  }
}

export default Select
