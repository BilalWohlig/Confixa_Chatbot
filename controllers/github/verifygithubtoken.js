const express = require('express')
const router = express.Router()
const __constants = require('../../config/constants')
const validationOfAPI = require('../../middlewares/validation')
const { getrepos } = require('../../services/github/allrepos')
const { userExists } = require('../../queries/common/common')
const { saveGithubToken, updateUser } = require('../../queries/github/savegithubtoken')
const Pool = require('../../lib/db/postgres').pool

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
    // org: { type: 'string', required: true }
  }
}
const validation = (req, res, next) => {
  return validationOfAPI(req, res, next, validationSchema, 'query')
}
const verifytokens = async (req, res) => {
  try {
    // console.log(req.body.user_id)
    const result = await getrepos(req.headers.authorization, req.body)
    // console.log(result)
    if (result.status_code) {
      res.sendJson({
        type: __constants.RESPONSE_MESSAGES.FAILED,
        data: result
      })
    } else {
      const result1 = await Pool.query(userExists(req.body.user_id))
      if (result1.rowCount === 0) {
        // create user
        console.log('creating')
        const result = await Pool.query(saveGithubToken(req.headers.authorization, req.body.user_id))
        if (result.rowCount !== 1) {
          return res.sendJson({
            type: __constants.RESPONSE_MESSAGES.FAILED,
            data: result
          })
        }
      } else {
        console.log('updating')
        const result = await Pool.query(updateUser(req.body.user_id, req.headers.authorization))
        if (result.rowCount === 0) {
          return res.sendJson({
            type: __constants.RESPONSE_MESSAGES.FAILED,
            data: result
          })
        }
      }
      return res.sendJson({
        type: __constants.RESPONSE_MESSAGES.SUCCESS,
        data: result
      })
    }
  } catch (err) {
    return res.sendJson({ type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
  }
}
router.post('/verifygithub', validation, verifytokens)
module.exports = router
