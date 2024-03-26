const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')
var path = require('path')
var fs = require('fs')

class Flow {
  async flow (githubtoken, data, staticpath, gitpath) {
    // console.log("hello1",data)
    const method = 'PUT'
    const endpointurl = '/repos/' + data.username + '/' + data.reponame + '/contents/' + gitpath + data.filename
    var jsonPath = path.join(__dirname, staticpath)
    // console.log(jsonPath)
    var jsonString = fs.readFileSync(jsonPath, 'utf8')
    const base64 = btoa(jsonString)
    data.content = base64
    // console.log(data)
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
      // console.log('------', response)
      return response?.data
    } catch (error) {
      if (error && error.response && error.response?.data) {
        console.log('19 ::', error)
        return __constants.RESPONSE_MESSAGES.FILE_EXIST
      }
      console.log('22 ::', error)
      return __constants.RESPONSE_MESSAGES.FILE_CREATED_ISSUE
    }
  }
}

module.exports = new Flow()
