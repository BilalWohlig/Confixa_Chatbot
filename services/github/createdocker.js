const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')
var path = require('path')
var fs = require('fs')

class CreateDocker {
  async createdockerfile (githubtoken, data) {
    const method = 'PUT'
    const endpointurl = '/repos/' + data.username + '/' + data.reponame + '/contents/Dockerfile'
    // var jsonPath = path.join(__dirname, '../../static/Dockerfile')
    // console.log(jsonPath)
    // var jsonString = fs.readFileSync(jsonPath, 'utf8')
    // const base64 = btoa(jsonString)
    data.content = data.dockerfile
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
      console.log('19 ::::')
      return response?.data
    } catch (error) {
      if (error && error.response && error.response?.data) {
        console.log('19 :::')
        error.response.data.filename = 'Dockerfile Already exists'
        return error.response?.data
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.FILE_CREATED_ISSUE
    }
  }
}

module.exports = new CreateDocker()
