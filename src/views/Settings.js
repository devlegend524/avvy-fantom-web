import React from 'react'
import { DownloadIcon, UploadIcon, TrashIcon } from '@heroicons/react/outline'

import services from 'services'


class Settings extends React.PureComponent {
  render() {
    return (
      <div className='max-w-md m-auto'>
        <div className='mb-8 font-bold text-center mt-4 text-lg'>{'Settings'}</div>
        <div onClick={() => services.data.backup()} className="flex cursor-pointer justify-between bg-gray-100 dark:bg-gray-700 font-bold p-4 rounded mb-2">
          <div>{'Backup Data'}</div>
          <DownloadIcon className="h-6" />
        </div>
        <div onClick={() => services.data.restore()} className="flex cursor-pointer justify-between bg-gray-100 dark:bg-gray-700 font-bold p-4 rounded mb-2">
          <div>{'Restore Data'}</div>
          <UploadIcon className="h-6" />
        </div>
        <div onClick={() => services.data.reset()} className="flex cursor-pointer justify-between bg-gray-100 dark:bg-gray-700 font-bold p-4 rounded mb-2">
          <div>{'Reset Data'}</div>
          <TrashIcon className="h-6" />
        </div>
      </div>
    )
  }
}

export default Settings
