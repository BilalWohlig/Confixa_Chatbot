const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')

class CreateRepoVar {
  async createrepovar (githubtoken, data) {
    console.log(data)
    data.name = 'BRANCH'
    data.value = data.branch
    const method = 'POST'
    const endpointurl = '/repos/' + data.username + '/' + data.reponame + '/actions/variables'
    console.log(endpointurl)
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
      console.log('njfurbvjf', response)
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

module.exports = new CreateRepoVar()
