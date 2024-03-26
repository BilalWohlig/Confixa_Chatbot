const express = require('express')
const router = express.Router()
const __constants = require('../../config/constants')
const validationOfAPI = require('../../middlewares/validation')
const { createreposinorgs } = require('../../services/github/createrepoinorg')

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
    name: { type: 'string', required: true },
    private: { type: 'boolean', required: true },
    auto_init: { type: 'boolean', required: true },
    org: { type: 'string', required: true }
  }
}
const validation = (req, res, next) => {
  return validationOfAPI(req, res, next, validationSchema, 'body')
}
const createrepoinorg = async (req, res) => {
  try {
    console.log(req.body)
    const result = await createreposinorgs(req.headers.authorization, req.body)
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
    return res.sendJson({
      type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR,
      err: err.err || err
    })
  }
}
router.post('/createrepoinorgs', validation, createrepoinorg)
// router.get('/getPing', cache.route(100), validation, ping) // example for redis cache in routes
module.exports = router
