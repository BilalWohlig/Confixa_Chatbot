const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')

class CreateFiles {
  async createfiles (githubtoken, data) {
    const method = 'PUT'
    const endpointurl = '/repos/' + data.username + '/' + data.reponame + '/contents/' + data.filename + '.txt'
    const stringdata = data.content
    const base64 = btoa(stringdata)
    data.content = base64
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
      return response?.data
    } catch (error) {
      if (error && error.response && error.response?.data) {
        console.log('19 ::')
        return __constants.RESPONSE_MESSAGES.FILE_EXIST
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.FILE_CREATED_ISSUE
    }
  }
}

module.exports = new CreateFiles()
