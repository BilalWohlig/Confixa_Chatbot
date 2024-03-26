const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')
var path = require('path')
var fs = require('fs')

class Flow2 {
  async flow2 (githubtoken, data, staticpath, gitpath) {
    const method = 'PUT'
    const endpointurl = '/repos/' + data.username + '/' + data.reponame + '/contents/' + gitpath
    var jsonPath = path.join(__dirname, staticpath)

    var jsonString = fs.readFileSync(jsonPath, 'utf8')

    const base64 = btoa(jsonString)
    data.content = base64
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
      return response?.data
    } catch (error) {
      if (error && error.response && error.response?.data) {
        console.log('19 :::')
        error.response.data.filename = `${gitpath} Already exists`
        return error.response?.data
      }
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FILE_CREATED_ISSUE
    }
  }
}

module.exports = new Flow2()
