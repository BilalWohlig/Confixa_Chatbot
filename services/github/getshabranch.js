const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')

class GetSHABranch {
  async getprevshabranch (githubtoken, data) {
    console.log('hello')
    const method = 'GET'
    const endpointurl = '/repos/' + data.username + '/' + data.reponame + '/branches/' + data.headbranch
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken)
      console.log('commmit shaaaaa', response?.data.commit.sha)
      return response?.data.commit.sha
    } catch (error) {
      if (error && error.response && error.response?.data) {
        console.log('19 ::')
        return __constants.RESPONSE_MESSAGES.FAILED
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.REPO_CREATED_ISSUE
    }
  }
}

module.exports = new GetSHABranch()
