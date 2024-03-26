const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')
const { getprevshabranch } = require('../../services/github/getshabranch')

class CreateBranches {
  async createbranches (githubtoken, data) {
    console.log(data)
    const prevsha = await getprevshabranch(githubtoken, data)
    console.log('returned sha', prevsha)
    const method = 'POST'

    data.sha = prevsha
    data.ref = 'refs/heads/' + data.ref
    console.log('newdata', data)
    // const endpointurl = '/repos/' + __constants.GITHUB_USER + '/' + __constants.GITHUB_REPO + '/git/refs'
    const endpointurl = '/repos/' + data.username + '/' + data.reponame + '/git/refs'
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
      return response?.data
    } catch (error) {
      if (error && error.response && error.response?.data) {
        console.log('19 ::', error)
        return __constants.RESPONSE_MESSAGES.BRANCH_DETAILS_EXIST
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.BRANCH_CREATED_ISSUE
    }
  }
}

module.exports = new CreateBranches()
