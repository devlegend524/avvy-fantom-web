import React from 'react'
import { useNavigate } from 'react-router-dom'

function Button(props) {
  let navigator = useNavigate()

  const onClick = (e) => {
    e.preventDefault()
    if (props.onClick) props.onClick(navigator)
  }

  return (
    <div onClick={onClick} className='cursor-pointer rounded-xl p-4 bg-grayish-300 text-white font-bold text-center'>
      {props.text}
    </div>
  )
}

export default Button

/*
class Button extends React.PureComponent {
  onClick() {
    if (this.props.onClick) this.props.onClick()
  }

  render() {
    return (
      <div onClick={this.onClick.bind(this)} className='cursor-pointer rounded-xl p-4 bg-grayish-300 text-white font-bold text-center'>
        {this.props.text}
      </div>
    )
  }
}

export default Button

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from '@heroicons/react/solid'

import services from 'services'

function DomainSearch(props) {
  let navigator = useNavigate()
  let onBeforeSubmit = props.onBeforeSubmit
  let textInput = React.createRef()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onBeforeSubmit) onBeforeSubmit()
    const domain = textInput.current.value
    textInput.current.value = ''
    services.linking.navigate(navigator, 'Domain', { domain })
  }
  
  return (
    <div className='bg-gray-100 rounded-xl w-full text-center relative'>
      <form onSubmit={handleSubmit}>
        <input autoComplete="off" ref={textInput} autoCapitalize="off" placeholder={props.placeholder || 'Search domain names'} className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
      </form>
      <div className='absolute right-0 top-0 h-full flex items-center justify-center mr-4 pointer-events-none'>
        <SearchIcon className='w-6 text-gray-300' />
      </div>
    </div>
  )
}

export default DomainSearch
*/
