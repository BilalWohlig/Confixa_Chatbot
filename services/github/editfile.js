const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')
const { getprevsha } = require('../../services/github/getprevsha')

class EditFile {
  async editfiles (githubtoken, data) {
    console.log(data.username)
    const url = '/repos/' + data.username + '/' + data.reponame + '/contents/' + data.filename
    console.log(url)
    const prevsha = await getprevsha(githubtoken, data)
    console.log('prevsha 90::', prevsha)
    data.sha = prevsha.sha
    const method = 'PUT'
    const endpointurl = '/repos/' + data.username + '/' + data.reponame + '/contents/' + data.filename
    console.log('hellooooo50', data.content)
    const base64 = btoa(data.content)
    data.content = base64
    console.log('hellooooo51', data.content)
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
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

module.exports = new EditFile()
