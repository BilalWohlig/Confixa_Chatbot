const express = require('express')
const router = express.Router()
const __constants = require('../../config/constants')
const validationOfAPI = require('../../middlewares/validation')
const langchain = require('../../services/elasticsearch/langchain')
// const { askQna } = require('../../services/elasticsearch/assistant')

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
    userQuestion: { type: 'string', required: true },
  }
}
const validation = (req, res, next) => {
  return validationOfAPI(req, res, next, validationSchema, 'body')
}
const chats = async (req, res) => {
  try {
    const result = await langchain.askQna(req.body.userQuestion)
    res.sendJson({ type: __constants.RESPONSE_MESSAGES.SUCCESS, data: result })
  } catch (error) {
    console.log('assistant chat contr', error)
    return __constants.RESPONSE_MESSAGES.FAILED
  }
}
router.post('/langchain', validation, chats)
module.exports = router
