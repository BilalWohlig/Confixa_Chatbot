const express = require('express')
const router = express.Router()
const __constants = require('../../config/constants')
const validationOfAPI = require('../../middlewares/validation')
const { createreposecret } = require('../../services/github/createreposecret')
const { createtokenassecret } = require('../../services/github/createtokenassecret')
const multerFileAPI = require('../../middlewares/multerFile')

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
* @author Vaishnavi Korgonkar, 18th January 2024
* *** Last-Updated :- Vaishnavi Korgaonkar, 18th January 2024 ***
*/
const validationSchema = {
  type: 'object',
  required: true,
  additionalProperties: false
  // properties: {
  // project_id: { type: 'string', required: true },
  // google_svc_key: { type: 'string', required: true },
  // artifact_repo: { type: 'string', required: true },
  // gh_user_id: { type: 'string', required: true }
  // }
}
const validation = (req, res, next) => {
  return validationOfAPI(req, res, next, validationSchema, 'query')
}

const multerFilesMiddleware = multerFileAPI.multerImageData(['GOOGLE_APPLICATION_CREDENTIALS'])

const repositoryconnection = async (req, res) => {
  try {
    console.log('jeb')
    const org_and_repo = req.body.reponame
    const parts = org_and_repo.split('/')

    if (parts) {
      const organization = parts[0]
      const repoName = parts[1]
      req.body.reponame = repoName
      req.body.org = organization
    } else {
      return res.sendJson({
        type: __constants.RESPONSE_MESSAGES.ORG_NOT_FOUND,
        data: null
      })
    }
    const content = Buffer.from(req.files.GOOGLE_APPLICATION_CREDENTIALS[0].buffer)
    // console.log(content)
    const github_token = await createtokenassecret(req.headers.authorization, req.body)
    const svc_acc_secret = await createreposecret(req.headers.authorization, req.body, content)
    // console.log(svc_acc_secret)
    // console.log(base64Data)
    const PROJECT_ID = await createreposecret(req.headers.authorization, req.body, '', 'PROJECT_ID')
    // console.log(PROJECT_ID)
    const GCR = await createreposecret(req.headers.authorization, req.body, '', 'GCR')
    // console.log(GCR)
    const GH_USER = await createreposecret(req.headers.authorization, req.body, '', 'GH_USER')

    const REGION = await createreposecret(req.headers.authorization, req.body, '', 'REGION')
    // console.log(REGION)
    // const result = await createreposecret(req.headers.authorization, req.body)
    if (REGION.status_code) {
      res.sendJson({
        type: __constants.RESPONSE_MESSAGES.FAILED,
        data: REGION
      })
    } else {
      res.sendJson({
        type: __constants.RESPONSE_MESSAGES.SUCCESS,
        data: REGION
      })
    }
  } catch (err) {
    return res.sendJson({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
  }
}
router.post('/artifact', validation, multerFilesMiddleware, repositoryconnection)
module.exports = router
