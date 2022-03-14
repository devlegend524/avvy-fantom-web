import React from 'react'


class DomainPrivacy extends React.PureComponent {
  render() {
    return (
      <>
        <div className='grid gap-2 grid-cols-1 md:grid-cols-2 w-full'>
          <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-xl'>
            <div className='font-bold'>{'Standard Privacy'}</div>
            <ul className='list-disc pl-4 mt-4 text-sm'>
              <li>{'Anyone on the blockchain can read your domain names'}</li>
              <li>{'NFT exchanges can list your domain names'}</li>
              <li>{'Your wallet will always remember your domain names'}</li>
              <li>{'Reverse resolution will work for your domain names'}</li>
            </ul>
          </div>
          <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-xl'>
            <div className='font-bold'>{'Enhanced Privacy'}</div>
            <ul className='list-disc pl-4 mt-4 text-sm'>
              <li>{'Internet users cannot read your domain names*'}</li>
              <li>{'NFT exchanges cannot list your domain names*'}</li>
              <li>{'Your wallet will not remember your domain names**'}</li>
              <li>{'Reverse resolution will not work for your domain names'}</li>
            </ul>
          </div>
        </div>
        <div className='text-gray-500 text-xs mt-4'>
          <div>{'* In some cases, it may be possible to read Enhanced Privacy domains'}</div>
          <div>{'** With Enhanced Privacy, you must remember the domain name you have registered or back up your data'}</div>
          <div className='mt-4'><a target="_blank" href="https://avvy.domains/blog/enhanced-privacy/" className='underline'>{'Read more about Enhanced Privacy'}</a></div>
        </div>
      </>
    )
  }
}

export default DomainPrivacy
