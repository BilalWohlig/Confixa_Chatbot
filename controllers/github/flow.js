const express = require('express')
const router = express.Router()
const __constants = require('../../config/constants')
const validationOfAPI = require('../../middlewares/validation')
var fs = require('fs')
const { flow } = require('../../services/github/flow')
const { createrepos } = require('../../services/github/createrepo')
const { getrepos } = require('../../services/github/allrepos')

/**
 * @namespace -HEALTH-CHECK-MODULE-
 * @description API’s related to HEALTH CHECK module.
 */
/**
 * @memberof -HEALTH-CHECK-module-
 * @name getPing
 * @path {GET} /api/healthCheck/getPing
 * @description Bussiness Logic :- In getPing API, we are just returning the sucess response and data true.
 * @response {string} ContentType=application/json - Response content type.
 * @response {string} metadata.msg=Success  - Response got successfully.
 * @response {string} metadata.data - It will return the data.
 * @code {200} if the msg is success the api returns succcess message.
 * @author Vaishnavi Korgaonkar, 18th January 2024
 * *** Last-Updated :- Vaishnavi Korgaonkar, 18th January 2024 ***
 */
const validationSchema = {
  type: 'object',
  required: true,
  properties: {
    message: { type: 'string', required: true },
    // content: { type: 'string', required: true },
    branch: { type: 'string', required: true },
    username: { type: 'string', required: true },
    reponame: { type: 'string', required: true },
    filename: { type: 'string', required: true }
  }
}
const validation = (req, res, next) => {
  return validationOfAPI(req, res, next, validationSchema, 'body')
}
const createfileinfolder = async (req, res) => {
  try {
    let flag
    const result = await flow(req.headers.authorization, req.body, '../../static/github_actions.yaml', __constants.GITHUB_ACTIONS_FILEPATH)
    const lsrepos = await getrepos(req.headers.authorization)
    for (const repo of lsrepos) {
      if (repo.name === `${req.body.reponame}-gitops`) {
        console.log(repo.name, '"repo exists"')
        flag = true
        break
      }
    }
    if (!flag) {
      console.log('"creating repo"')
      const repobody = { name: `${req.body.reponame}-gitops`, private: true, auto_init: true }
      const creategitops = await createrepos(req.headers.authorization, repobody)
      console.log('"gitops repo"', creategitops)
    }
    console.log('"here"')

    // req.body.reponame = `${req.body.reponame}-gitops`
    // req.body.filename = 'dev-rbi-backend.yaml'
    // // console.log('"hello2"', req.body)
    // const createmanifests = await flow(req.headers.authorization, req.body, '../../static/deployment.apps/dev-rbi-backend.yaml', 'deployment.apps/')
    // console.log(createmanifests)
    if (result.status_code) {
      res.sendJson({
        type: __constants.RESPONSE_MESSAGES.FAILED,
        data: result
      })
    } else {
      res.sendJson({
        type: __constants.RESPONSE_MESSAGES.SUCCESS,
        data: result
      })
    }
  } catch (err) {
    return res.sendJson({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
  }
}
router.put('/websvc', validation, createfileinfolder)
module.exports = router
