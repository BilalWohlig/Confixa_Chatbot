const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')

class CreateReposInOrg {
  async createreposinorgs (githubtoken, data) {
    const method = 'POST'
    const endpointurl = '/orgs/' + data.org + '/repos'
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
      console.log('--------------------------------', response)
      return response?.data
    } catch (error) {
      if (error && error.response && error.response?.data) {
        console.log('19 ::', error)
        return error.response?.data
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.REPO_CREATED_ISSUE
    }
  }
}

module.exports = new CreateReposInOrg()
