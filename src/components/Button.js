import React from 'react'

class Button extends React.PureComponent {
  render() {
    return (
      <div className='cursor-pointer rounded-xl p-4 bg-grayish-300 text-white font-bold text-center'>
        {this.props.text}
      </div>
    )
  }
}

export default Button
