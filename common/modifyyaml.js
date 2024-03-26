const __constants = require('../config/constants')
const fs = require('fs')
const yaml = require('js-yaml')

class ModifyYaml {
  async modifyyaml (data) {
    try {
      var workflow
      var locn
      if (!data.dockerfile) {
        workflow = fs.readFileSync('./static/buildpack.YAML', 'utf8')
        locn = './static/buildpack.YAML'
      } else {
        workflow = fs.readFileSync('./static/github_actions.yaml', 'utf8')
        locn = './static/github_actions.yaml'
      }
      console.log(workflow)
      const parsedyaml = yaml.load(workflow)
      parsedyaml.on.push.branches[0] = data.branch
      const updatedWorkflow = yaml.dump(parsedyaml)
      fs.writeFileSync(locn, updatedWorkflow)
      return true
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

module.exports = new ModifyYaml()
