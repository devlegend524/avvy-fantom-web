import React from 'react'


class Modal extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
    }
  }

  toggle() {
    this.setState(state => ({
      open: !state.open
    }), () => {
      if (this.state.open && this.props.onOpen) {
        this.props.onOpen()
      }
    })
  }

  render() {
    const open = this.state.open
    return (
      <div className={`duration-150 transition-all flex items-center justify-center z-10 fixed top-0 left-0 w-full h-full ${open ? 'pointer-events-all opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div onClick={this.toggle.bind(this)} className='absolute top-0 left-0 z-0 w-full h-full backdrop-blur-sm'></div>
        <div className='bg-black opacity-25 z-10 absolute top-0 left-0 w-full h-full pointer-events-none'></div>
        <div onClick={(e) => e.stopPropagation()} className='bg-white rounded max-w-screen-md w-full border-gray-200 border p-4 shadow relative z-20'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Modal
