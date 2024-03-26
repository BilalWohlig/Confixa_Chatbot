const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')
const { getprevshabranch } = require('../../services/github/getshabranch')

class CreateBrancheInOrg {
  async createbranchesinorg (githubtoken, data) {
    var oldrepo_name = data.reponame
    data.reponame = data.reponame + '-' + __constants.GITOPS_REPO
    data.ref = __constants.GITOPS_BRANCH
    data.headbranch = 'main'
    const prevsha = await getprevshabranch(githubtoken, data)
    console.log('returned sha', prevsha)
    const method = 'POST'

    data.sha = prevsha
    data.ref = 'refs/heads/' + data.ref
    console.log(data)
    const endpointurl = '/repos/' + data.username + '/' + data.reponame + '/git/refs'
    try {
      const response = await githubAPI.callGitHubAPI(method, endpointurl, githubtoken, data)
      console.log('njfurbvjf', response)
      data.reponame = oldrepo_name
      return response?.data
    } catch (error) {
      if (error && error.response && error.response?.data) {
        console.log('19 ::', error)
        return error.response?.data
      }
      console.log('22 ::')
      return __constants.RESPONSE_MESSAGES.BRANCH_CREATED_ISSUE
    }
  }
}

module.exports = new CreateBrancheInOrg()
