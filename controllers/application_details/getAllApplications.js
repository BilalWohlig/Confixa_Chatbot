const express = require('express')
const router = express.Router()
const __constants = require('../../config/constants')
const validationOfAPI = require('../../middlewares/validation')
const getAllApplications = require('../../services/application_details/getAllApplications')

const validationSchema = {
  type: 'object',
  required: true,
  properties: {
  },
  additionalProperties: false
}

const validation = (req, res, next) => {
  return validationOfAPI(req, res, next, validationSchema, 'query')
}

const getAllApplication = async (req, res) => {
  try {
    const result = await getAllApplications({
      ...req.query,
      page: req.query.page,
      pageSize: req.query.pageSize
    })
    if (result.status_code || result.error) {
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
    console.log('getAllApplications err 53 :: ', err)
    return res.sendJson({
      type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR,
      err: err.err || err
    })
  }
}

router.post('/getAllApplications', validation, getAllApplication)
module.exports = router
