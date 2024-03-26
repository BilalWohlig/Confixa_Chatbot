const express = require('express')
const router = express.Router()
const __constants = require('../../config/constants')
const validationOfAPI = require('../../middlewares/validation')
const { getresponse } = require('../../services/elasticsearch/getresponses')

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
    index: { type: 'string', required: true },
    startTime: { type: 'string', required: true },
    endTime: { type: 'string', required: true }
  }
}
const validation = (req, res, next) => {
  return validationOfAPI(req, res, next, validationSchema, 'body')
}
const getreponse = async (req, res) => {
  try {
    const result = await getresponse(req.body)
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
  } catch (error) {
    console.log('22 :::', error)
    return __constants.RESPONSE_MESSAGES.ERROR_CALLING_PROVIDER
  }
}
router.post('/getresponse', validation, getreponse)
module.exports = router
