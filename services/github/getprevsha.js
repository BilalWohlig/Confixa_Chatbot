const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')

class GetSHA {
  async getprevsha (githubtoken, data) {
    const method = 'GET'
    console.log('data', data)
    const endpointurl = '/repos/' + data.username + '/' + data.reponame + '/contents/' + data.filename
    console.log('here2', endpointurl)
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken)
      console.log('sha', response)
      return response?.data
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

module.exports = new GetSHA()
