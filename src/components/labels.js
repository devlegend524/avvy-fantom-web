import { CheckCircleIcon } from '@heroicons/react/solid'
import { InformationCircleIcon } from '@heroicons/react/outline'

function Information(props) {
  return (
    <div className='flex items-start justify-center'>
      <InformationCircleIcon className='w-6 text-gray-400 mr-2 flex-shrink-0' />
      <div className='text-gray-400'>{props.text}</div>
    </div>
  )
}

function Error(props) {
  return (
    <div className='flex items-center justify-center'>
      <InformationCircleIcon className='w-6 text-alert-red mr-2' />
      <div className='text-alert-red'>{props.text}</div>
    </div>
  )
}

function Success(props) {
  return (
    <div className='flex items-center justify-center'>
      <CheckCircleIcon className='w-6 text-alert-blue mr-2' />
      <div className='text-alert-blue'>{props.text}</div>
    </div>
  )
}

const exports = {
  Information,
  Error,
  Success,
}

export default exports
