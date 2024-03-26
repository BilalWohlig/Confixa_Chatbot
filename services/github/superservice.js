const __constants = require('../../config/constants')
const githubAPI = require('../../common/githubAPI')
const { modifyyaml } = require('../../common/modifyyaml')
const { createdockerfile } = require('../../services/github/createdocker')
const { flow2 } = require('../../services/github/flow2')
const { getrepos } = require('../../services/github/allrepos')
const { createreposinorgs } = require('../../services/github/createrepoinorg')
const { createbranchesinorg } = require('../../services/github/createbranchinorg')

class SuperService {
  async webservice (githubtoken, data) {
    try {
      var result
      const modify = modifyyaml(data)
      console.log(modify)
      let flag = false
      if (data.dockerfile) {
        const dockerfile = await createdockerfile(githubtoken, data)
        if (dockerfile.message) {
          return dockerfile
        }
        const githubactionsresult = await flow2(githubtoken, data, '../../static/github_actions.yaml', `.github/workflows/${data.filename}`)
        if (githubactionsresult.message) {
          return githubactionsresult
        }
      } else {
        const dockerbuildworkflow = await flow2(githubtoken, data, '../../static/buildpack.YAML', `.github/workflows/${data.filename}`)
        if (dockerbuildworkflow.message) {
          return dockerbuildworkflow
        }
      }

      const lsrepos = await getrepos(githubtoken)
      const repos_name = lsrepos.map(item => item.name)
      console.log(repos_name)
      if (repos_name.includes(data.reponame + '-' + __constants.GITOPS_REPO)) {
        flag = true
      }
      // console.log('flaggggggggg', flag)

      let backend = false
      if ((data.reponame).includes('backend')) {
        backend = true
      }
      // console.log('backend', backend)
      if (flag === false) {
        var gitops_repo_name = data.reponame + '-' + __constants.GITOPS_REPO
        const repobody = { name: gitops_repo_name, private: true, auto_init: true, org: data.username }
        const creategitops = await createreposinorgs(githubtoken, repobody)
        const createbranch = await createbranchesinorg(githubtoken, data)
        data.reponame = gitops_repo_name
        data.branch = __constants.GITOPS_BRANCH
        await flow2(githubtoken, data, '../../static/configmap/rbi-configmap.yaml', `configmap/${data.servicename}-configmap.yaml`)
        if (backend === true) {
          // console.log("backend true")
          await flow2(githubtoken, data, '../../static/deployment.apps/dev-rbi-backend.yaml', `deployment.apps/dev-${data.servicename}-backend.yaml`)
          await flow2(githubtoken, data, '../../static/service/dev-rbi-backend.yaml', `service/dev-${data.servicename}-backend.yaml`)
          result = await flow2(githubtoken, data, '../../static/http.proxy/dev-rbi-backend.yaml', `http.proxy/dev-${data.servicename}-backend.yaml`)
        } else {
          // console.log("backend not found")
          await flow2(githubtoken, data, '../../static/deployment.apps/dev-rbi-frontend.yaml', `deployment.apps/dev-${data.servicename}-frontend.yaml`)
          await flow2(githubtoken, data, '../../static/service/dev-rbi-frontend.yaml', `service/dev-${data.servicename}-frontend.yaml`)
          result = await flow2(githubtoken, data, '../../static/http.proxy/dev-rbi-frontend.yaml', `http.proxy/dev-${data.servicename}-frontend.yaml`)
        }
      } else {
        var gitops_repo_name = data.reponame + '-' + __constants.GITOPS_REPO
        data.reponame = gitops_repo_name
        data.branch = __constants.GITOPS_BRANCH
        await flow2(githubtoken, data, '../../static/configmap/rbi-configmap.yaml', `configmap/${data.servicename}-configmap.yaml`)
        if (backend === true) {
          await flow2(githubtoken, data, '../../static/deployment.apps/dev-rbi-backend.yaml', `deployment.apps/dev-${data.servicename}-backend.yaml`)
          await flow2(githubtoken, data, '../../static/service/dev-rbi-backend.yaml', `service/dev-${data.servicename}-backend.yaml`)
          result = await flow2(githubtoken, data, '../../static/http.proxy/dev-rbi-backend.yaml', `http.proxy/dev-${data.servicename}-backend.yaml`)
        } else {
          // console.log("frontend")
          await flow2(githubtoken, data, '../../static/deployment.apps/dev-rbi-frontend.yaml', `deployment.apps/dev-${data.servicename}-frontend.yaml`)
          await flow2(githubtoken, data, '../../static/service/dev-rbi-frontend.yaml', `service/dev-${data.servicename}-frontend.yaml`)
          result = await flow2(githubtoken, data, '../../static/http.proxy/dev-rbi-frontend.yaml', `http.proxy/dev-${data.servicename}-frontend.yaml`)
        }
      }
      return result
    } catch (err) {
      return __constants.RESPONSE_MESSAGES.SERVER_ERROR
    }
  }
}

module.exports = new SuperService()
