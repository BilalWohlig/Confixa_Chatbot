const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')
const { publickey } = require('../../services/github/secretpublickey')
var path = require('path')
var fs = require('fs')
const sodium = require('@devtomio/sodium')

class CreateReposecret {
  async createreposecret (githubtoken, data, content, secretname) {
    console.log('reposecret')
    const publickey2 = await publickey(githubtoken, data)
    console.log('publickey2', publickey2)
    data.key_id = publickey2.key_id
    const key = publickey2.key
    if (!content) {
      // console.log(data, content, secretname)
      // var jsonPath = path.join(__dirname, '../../static/secretvalue.txt')
      // var value = fs.readFileSync(jsonPath, 'utf8')
      console.log(data, secretname)
      var value = data[secretname]
      console.log('value', value)
      const messageBytes = Buffer.from(value)
      // console.log("messageBytes", messageBytes)
      const keyBytes = Buffer.from(key, 'base64')
      // console.log(keyBytes)
      const encryptedBytes = sodium.crypto_box_seal(messageBytes, keyBytes)
      const encrypted = Buffer.from(encryptedBytes).toString('base64')
      // console.log(encrypted)
      data.encrypted_value = encrypted
      var endpointurl = `/repos/${data.org}/${data.reponame}/actions/secrets/${secretname}`
      console.log(endpointurl)
    } else {
      console.log('hello1')
      const messageBytes = content
      const keyBytes = Buffer.from(key, 'base64')
      // console.log(messageBytes)
      // console.log(keyBytes)
      const encryptedBytes = sodium.crypto_box_seal(messageBytes, keyBytes)
      const encrypted = Buffer.from(encryptedBytes).toString('base64')
      // console.log(encrypted)
      data.encrypted_value = encrypted
      endpointurl = `/repos/${data.org}/${data.reponame}/actions/secrets/${data.secretname}`
    }

    const method = 'PUT'
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
      return true
    } catch (error) {
      if (error && error.response && error.response?.data) {
        console.log('19 ::')
        return __constants.RESPONSE_MESSAGES.REPO_DETAILS_EXIST
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.REPO_CREATED_ISSUE
    }
  }
}

module.exports = new CreateReposecret()
