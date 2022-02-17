import files from './files'

const data = {
  backup: () => {
    const data = window.localStorage.getItem('persist:root')
    const timestamp = parseInt(Date.now())
    files.download(data, 'application/json', `avvy-backup-${timestamp}.json`)
  },
  
  restore: async () => {
    if (window.confirm("Restoring data will overwrite any existing data. Please back up existing data before proceeding. Would you like to proceed?")) {
      const data = await files.upload()
      window.localStorage.setItem('persist:root', data)
      window.location.reload()
    }
  },

  reset: () => {
    if (window.confirm("Your browser stores your auction bids, as well as your hidden domain names. Please ensure you have backed up your data before continuing.")) { 
      window.localStorage.setItem('persist:root', null)
      window.location.reload()
    }
  }
}

export default data
