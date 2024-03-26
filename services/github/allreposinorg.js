const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')

class GetOrgs {
  async getorgs (githubtoken, data) {
    const method = 'GET'
    const endpointurl = `/orgs/${data.org}/repos`
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, {})
      return response?.data
    } catch (error) {
      if (error && error.response && error.response?.data) {
        if (error.response?.data.message === 'Bad credentials') {
          return __constants.RESPONSE_MESSAGES.NOT_AUTHORIZED
        }
        return __constants.RESPONSE_MESSAGES.INVALID_REQUEST
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER
    }
  }
}

module.exports = new GetOrgs()
