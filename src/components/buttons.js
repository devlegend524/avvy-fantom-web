import { useNavigate } from 'react-router-dom'

function Button(props) {
  let navigator = useNavigate()

  const onClick = (e) => {
    e.preventDefault()
    if (props.onClick) props.onClick(navigator)
  }

  return (
    <div onClick={onClick} className={`cursor-pointer rounded-xl p-4 bg-grayish-300 text-white font-bold text-center ${props.className ? props.className : ''}`}>
      {props.text}
    </div>
  )
}

function Transparent(props) {
  let navigator = useNavigate()

  const onClick = (e) => {
    e.preventDefault()
    if (props.onClick) props.onClick(navigator)
  }

  return (
    <div onClick={onClick}>
      {props.children}
    </div>
  )
}

export default {
  Button,
  Transparent,
}
