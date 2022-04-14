import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

import components from 'components'


function AddRecord(props) {
  let inputRef
  let selectRef

  const handleSubmit = () => {
    let type = selectRef.getValue()
    let value = inputRef.value 
    props.handleSubmit(type, value)
  }

  const options = [
    { name: 'X-Chain Address', value: 1 },
    { name: 'C-Chain Address', value: 2 },
    { name: 'Nickname', value: 3 },
    { name: 'Avatar', value: 4 },
    { name: 'CNAME Record', value: 5 },
    { name: 'A Record', value: 6 },
  ]

  return (
    <>
      <div className='max-w-md m-auto'>
        <div className='font-bold mb-2'>
          Type
        </div>
        <components.Select options={options} ref={(ref) => selectRef = ref} />
        <div className='font-bold mt-4 mb-2'>
          Value
        </div>
        <input type='text' className='bg-gray-100 dark:bg-gray-800 w-full rounded-xl px-4 py-2' ref={(ref) => inputRef = ref} />
        <div className='mt-8'>
          <components.buttons.Button sm={true} text={'Submit'} onClick={handleSubmit} loading={props.loading} />
        </div>
      </div>
    </>
  )
}

export default AddRecord
