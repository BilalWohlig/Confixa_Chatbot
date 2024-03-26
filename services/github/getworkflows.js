const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')

class GetWorkflows {
  async getworkflow (githubtoken, data) {
    const method = 'GET'
    // const endpointurl = `/repos/${data.username}/${data.repo}/actions/workflows`
    const endpointurl = `/repos/${data.org}/${data.repo}/actions/workflows`
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, {})
      return response?.data
    } catch (error) {
      if (error && error.response && error.response?.data) {
        console.log('19 ::')
        return __constants.RESPONSE_MESSAGES.NOT_FOUND
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER
    }
  }
}

module.exports = new GetWorkflows()
