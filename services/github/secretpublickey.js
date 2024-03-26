const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')

class Publickey {
  async publickey (githubtoken, data) {
    console.log('here3')
    console.log(data, githubtoken)
    const method = 'GET'
    const endpointurl = `/repos/${data.org}/${data.reponame}/actions/secrets/public-key`
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
      return response?.data
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

module.exports = new Publickey()
