const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')

class GetWorkflowRuns {
  async getworkflowruns (githubtoken, data) {
    const method = 'GET'
    const endpointurl = `/repos/${data.org}/${data.repo}/actions/workflows/${data.workflow_id}/runs`
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

module.exports = new GetWorkflowRuns()
