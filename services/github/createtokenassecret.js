const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')
const { publickey } = require('../../services/github/secretpublickey')
const sodium = require('@devtomio/sodium')

class CreateTokensecret {
  async createtokenassecret (githubtoken, data, content, secretname) {
    const publickey2 = await publickey(githubtoken, data)
    console.log('publickey2', publickey2)
    data.key_id = publickey2.key_id
    const key = publickey2.key
    console.log('hello1')
    const messageBytes = Buffer.from(githubtoken)
    const keyBytes = Buffer.from(key, 'base64')
    const encryptedBytes = sodium.crypto_box_seal(messageBytes, keyBytes)
    const encrypted = Buffer.from(encryptedBytes).toString('base64')
    data.encrypted_value = encrypted
    var endpointurl = `/repos/${data.org}/${data.reponame}/actions/secrets/TOKEN`
    const method = 'PUT'
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
      if (!response.status_code) {
        return __constants.RESPONSE_MESSAGES.SUCCESS
      }
    } catch (error) {
      if (error && error.response && error.response?.data) {
        console.log('19 ::', error.response?.data)
        return __constants.RESPONSE_MESSAGES.FAILED
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new CreateTokensecret()
