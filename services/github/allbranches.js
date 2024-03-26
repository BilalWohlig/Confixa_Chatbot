const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')

class GetBranches {
  async getbranches (githubtoken, data) {
    const method = 'GET'
    const endpointurl = `/repos/${data.name}/${data.repo}/branches`
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, {})
      return response?.data
    } catch (error) {
      if (error && error.response && error.response?.data) {
        // console.log(error.response?.data)
        return error.response?.data
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.FAILED
    }
  }
}

module.exports = new GetBranches()
