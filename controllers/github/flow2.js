const express = require('express')
const router = express.Router()
const __constants = require('../../config/constants')
const validationOfAPI = require('../../middlewares/validation')
const { flow2 } = require('../../services/github/flow2')
const { createreposinorgs } = require('../../services/github/createrepoinorg')
const { getrepos } = require('../../services/github/allrepos')
const { createbranchesinorg } = require('../../services/github/createbranchinorg')
const { modifyyaml } = require('../../common/modifyyaml')
const { createdockerfile } = require('../../services/github/createdocker')
const { webservice } = require('../../services/github/superservice')
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
    filename: { type: 'string', required: true },
    dockerfile: { type: 'string', required: true },
    secretfile: { type: 'string', required: true },
    servicename: { type: 'string', required: true }
  }
}
const validation = (req, res, next) => {
  return validationOfAPI(req, res, next, validationSchema, 'body')
}
const createfileinfolder = async (req, res) => {
  try {
    console.log('hello1')
    const result = await webservice(req.headers.authorization, req.body)
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
    console.log(result)
  } catch (err) {
    return res.sendJson({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
  }
}
router.put('/websvc2', validation, createfileinfolder)
module.exports = router
