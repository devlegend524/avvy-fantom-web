import linkingService from 'services/linking'

const exports = {
  login: async (username, password) => {
    const res = await fetch(linkingService.backend('Login'), {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    return (await res.json()).token
  },

  resetPassword: async (email) => {
    const res = await fetch(linkingService.backend('ResetPassword'), {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
      })
    })
    return res.status === 200
  }, 

  setPassword: async (token, password, passwordConfirm) => {
    const res = await fetch(linkingService.backend('SetPassword'), {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        token,
        password,
        password_confirm: passwordConfirm
      })
    })
    return (await res.json())
  },

  createAccount: async (name, email) => {
    const res = await fetch(linkingService.backend('CreateAccount'), {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email
      })
    })
    return (await res.json())
  },

  getVerifyChallenge: async (token) => {
    const res = await fetch(linkingService.backend('GetChallenge'), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
    })
    return (await res.json()).challenge
  },

  submitVerifySignature: async (token, account, signature) => {
    const res = await fetch(linkingService.backend('VerifySignature'), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
    })
    return (await res.json()).challenge
  },
}

export default exports
