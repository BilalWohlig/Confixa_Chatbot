const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')

class CreateRepos {
  async createrepos (githubtoken, data) {
    const method = 'POST'
    const endpointurl = '/user/repos'
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

module.exports = new CreateRepos()
